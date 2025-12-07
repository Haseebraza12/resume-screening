from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import logging

from app.database import get_db
from app.models import User
from app.auth import get_current_user
from app.services.rag_service import rag_service

router = APIRouter(prefix="/jd-generator", tags=["Job Description Generator"])
logger = logging.getLogger(__name__)


class JDGenerationRequest(BaseModel):
    job_title: str
    department: str
    key_skills: str  # Comma-separated
    experience_level: str
    employment_type: str


class JDGenerationResponse(BaseModel):
    job_description: str
    extracted_keywords: list[str]
    success: bool


@router.post("/generate", response_model=JDGenerationResponse)
async def generate_job_description(
    request: JDGenerationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate a professional job description using LLM.
    
    Extracts keywords from job title, department, and skills,
    then uses LLM to create a comprehensive job description.
    """
    try:
        logger.info(f"🎯 Generating JD for: {request.job_title}")
        
        # Extract and process keywords
        keywords = extract_keywords(
            job_title=request.job_title,
            department=request.department,
            key_skills=request.key_skills
        )
        
        logger.info(f"📝 Extracted keywords: {keywords}")
        
        # Generate job description using LLM
        if not rag_service.llm_available or not rag_service.llm:
            # Fallback: Generate basic description without LLM
            job_description = generate_fallback_description(request, keywords)
            logger.warning("⚠️ LLM not available, using fallback description")
        else:
            # Use LLM to generate professional description
            job_description = generate_with_llm(request, keywords)
            logger.info("✅ JD generated successfully with LLM")
        
        return JDGenerationResponse(
            job_description=job_description,
            extracted_keywords=keywords,
            success=True
        )
        
    except Exception as e:
        logger.error(f"❌ JD generation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate job description: {str(e)}"
        )


def extract_keywords(job_title: str, department: str, key_skills: str) -> list[str]:
    """
    Extract relevant keywords from job inputs.
    
    Combines:
    - Important words from job title
    - Department name
    - All key skills
    """
    keywords = []
    
    # Extract from job title (remove common words)
    common_words = {'senior', 'junior', 'lead', 'manager', 'the', 'a', 'an', 'and', 'or'}
    title_words = [
        word.strip().lower() 
        for word in job_title.split() 
        if word.strip().lower() not in common_words and len(word.strip()) > 2
    ]
    keywords.extend(title_words)
    
    # Add department
    if department and department.strip():
        keywords.append(department.strip().lower())
    
    # Add skills (comma-separated)
    if key_skills and key_skills.strip():
        skills = [skill.strip().lower() for skill in key_skills.split(',') if skill.strip()]
        keywords.extend(skills)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_keywords = []
    for kw in keywords:
        if kw not in seen:
            seen.add(kw)
            unique_keywords.append(kw)
    
    return unique_keywords


def generate_with_llm(request: JDGenerationRequest, keywords: list[str]) -> str:
    """
    Generate job description using LLM with structured prompt.
    Optimized for 400-500 words with faster generation.
    """
    
    import random
    
    # Add variety for regeneration
    variety_seed = random.randint(1, 1000)
    
    logger.info("=" * 80)
    logger.info("🤖 STARTING LLM JOB DESCRIPTION GENERATION")
    logger.info("=" * 80)
    logger.info(f"📋 Job Title: {request.job_title}")
    logger.info(f"🏢 Department: {request.department}")
    logger.info(f"📊 Experience Level: {request.experience_level}")
    logger.info(f"💼 Employment Type: {request.employment_type}")
    logger.info(f"🎯 Key Skills: {request.key_skills}")
    logger.info(f"🔑 Extracted Keywords: {', '.join(keywords[:10])}")
    logger.info(f"🎲 Variety Seed: {variety_seed}")
    
    # Create concise, focused prompt with word limit
    system_prompt = f"""Write a professional job description in 200-300 words.

Job Details:
Title: {request.job_title}
Department: {request.department}
Experience: {request.experience_level}
Type: {request.employment_type}
Skills: {request.key_skills}

Format the output exactly as follows (start directly with section 1):

1. <b>About the Role</b>
[2-3 sentences. IMPORTANT: Bold the job title and 2-3 key adjectives using <b>tags</b>]

2. <b>Key Responsibilities</b>
[4-5 bullet points. IMPORTANT: Bold the first few words of each bullet point]

3. <b>Required Qualifications</b>
[Include these skills: {', '.join(keywords[:6])}. IMPORTANT: Bold the key skills and tools]

Variation seed: {variety_seed}"""

    try:
        logger.info("\n🔄 Calling Local LLM Pipeline...")
        logger.info("\n⏳ Generating... (this may take a while on CPU)")
        
        # Format input as messages for the pipeline
        messages = [
            {"role": "user", "content": system_prompt}
        ]
        
        # Call local pipeline
        output = rag_service.llm(messages)
        
        # Parse output from pipeline
        if isinstance(output, list) and len(output) > 0:
            generated_text = output[0]['generated_text']
            if isinstance(generated_text, list):
                response = generated_text[-1]['content']
            else:
                response = generated_text
        else:
            raise ValueError("Unexpected output format from LLM pipeline")
        
        logger.info("✅ LLM response received!")
        logger.info(f"📏 Response length: {len(response)} characters")
        
        # Clean up response
        body = response.strip()
        
        # Remove "Structure" or "Format" lines if leaked
        import re
        body = re.sub(r'Structure.*?:', '', body, flags=re.IGNORECASE)
        body = re.sub(r'Format.*?:', '', body, flags=re.IGNORECASE)
        body = re.sub(r'\(.*?words\):', '', body, flags=re.IGNORECASE)
        
        # Remove markdown formatting if present
        body = body.replace('**', '')
        body = body.replace('##', '')
        body = body.replace('###', '')
        
        # Construct the final output with the requested header pattern
        # Bold the labels and the main title for emphasis
        header = f"""<b>{request.job_title}</b>

<b>Department:</b> {request.department}

<b>Experience:</b> {request.experience_level}

<b>Type:</b> {request.employment_type}

<b>Key Skills:</b> {request.key_skills}"""

        # Combine header and body
        job_description = f"{header}\n\n{body}"
        
        logger.info(f"🧹 Cleaned response length: {len(job_description)} characters")
        
        # Ensure minimum length (at least 200 chars)
        if len(job_description) < 200:
            logger.warning("⚠️ LLM response too short, using fallback")
            return generate_fallback_description(request, keywords)
        
        # Truncate if too long (max ~700 words / 3500 chars)
        if len(job_description) > 3500:
            logger.info(f"✂️ Truncating response from {len(job_description)} to 3500 chars")
            job_description = job_description[:3500] + "..."
        
        logger.info("=" * 80)
        logger.info("✅ JOB DESCRIPTION GENERATED SUCCESSFULLY")
        logger.info("=" * 80)
        logger.info("\n📄 GENERATED CONTENT:")
        logger.info("-" * 80)
        logger.info(job_description)
        logger.info("-" * 80)
        
        return job_description
        
    except Exception as e:
        logger.error("=" * 80)
        logger.error(f"❌ LLM GENERATION FAILED: {str(e)}")
        logger.error("=" * 80)
        logger.info("🔄 Falling back to template-based generation")
        return generate_fallback_description(request, keywords)


def generate_fallback_description(request: JDGenerationRequest, keywords: list[str]) -> str:
    """
    Generate a concise job description without LLM (fallback).
    Optimized for 400-500 words with HTML formatting.
    """
    
    skills_list = [skill.strip() for skill in request.key_skills.split(',') if skill.strip()]
    skills_formatted = ', '.join(skills_list[:5])  # Limit to top 5 skills
    
    description = f"""<b>{request.job_title}</b>

<b>About the Role</b>
We are seeking a talented {request.job_title} to join our {request.department}. This {request.employment_type.lower()} position is ideal for a {request.experience_level.lower()} professional who is passionate about delivering exceptional results and driving innovation.

<b>Key Responsibilities</b>
1. Lead and contribute to high-impact projects within the {request.department}
2. Apply expertise in {skills_formatted} to solve complex challenges
3. Collaborate with cross-functional teams to achieve business objectives
4. Drive continuous improvement in processes and deliverables
5. Mentor team members and share knowledge across the organization

<b>Required Qualifications</b>
1. Proven experience as a {request.job_title} or similar role
2. Strong proficiency in {skills_formatted}
3. Excellent problem-solving and analytical skills
4. Strong communication and collaboration abilities
5. {request.experience_level} level experience in the field

<b>Preferred Qualifications</b>
1. Experience in {request.department.lower()} environment
2. Track record of successful project delivery
3. Passion for learning and staying updated with industry trends

<b>What We Offer</b>
1. Competitive salary and comprehensive benefits package
2. Opportunities for professional growth and development
3. Collaborative and innovative work environment
4. Flexible working arrangements

If you are a motivated {request.job_title} looking to make an impact, we would love to hear from you!"""

    return description
