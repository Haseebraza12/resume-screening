from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from datetime import datetime
import logging

from app.database import get_db
from app.models import User, Resume, Match, Job
from app.schemas import ResumeResponse, FileUploadResponse, MatchResponse
from app.auth import get_current_active_user, get_optional_current_user
from app.config import settings
from app.services.rag_service import rag_service
from app.routers.notifications import create_notification

router = APIRouter(prefix="/resumes", tags=["Resumes"])
logger = logging.getLogger(__name__)


@router.post("/upload-and-rank")
async def upload_and_rank_resumes(
    files: List[UploadFile] = File(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
    job_requirements: Optional[str] = Form(None),
    top_n: int = Form(10),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload resumes and automatically rank them using RAG pipeline.
    This endpoint:
    1. Uploads and processes PDF resumes
    2. Runs FAISS search to find top K candidates
    3. Reranks using CrossEncoder
    4. Selects top N candidates
    5. Generates LLM summaries explaining why each was selected
    6. Stores results for analytics display
    """
    
    logger.info("=" * 80)
    logger.info("🚀 UPLOAD AND RANK PIPELINE STARTED")
    logger.info("=" * 80)
    logger.info(f"📄 Files to process: {len(files)}")
    logger.info(f"💼 Job Title: {job_title}")
    logger.info(f"🎯 Top N to rank: {top_n}")
    logger.info("=" * 80)
    
    # Handle authentication (demo mode support)
    if not current_user:
        if not settings.ENABLE_DEMO_MODE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        # Get or create demo user
        demo_user = db.query(User).filter(User.email == "demo@example.com").first()
        if not demo_user:
            from app.auth import get_password_hash
            demo_user = User(
                email="demo@example.com",
                username="demo",
                hashed_password=get_password_hash("demo123"),
                full_name="Demo User",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
        current_user = demo_user
    
    # Create a temporary job record for this ranking session
    logger.info("📝 Creating job record...")
    job = Job(
        user_id=current_user.id,
        title=job_title,
        description=job_description,
        requirements=job_requirements.split('\n') if job_requirements else [],
        status='active'
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    logger.info(f"✅ Job created (ID: {job.id})")
    
    # STEP 1: Upload and process all resumes
    logger.info("\n" + "=" * 80)
    logger.info("STEP 1: UPLOADING AND PROCESSING RESUMES")
    logger.info("=" * 80)
    
    uploaded_resumes = []
    resume_texts = {}
    
    for idx, file in enumerate(files, 1):
        logger.info(f"\n📄 Processing file {idx}/{len(files)}: {file.filename}")
        
        # Validate file type
        if not file.filename.endswith('.pdf'):
            logger.warning(f"⚠️  Skipping {file.filename} - not a PDF")
            continue
        
        # Read and validate file size
        content = await file.read()
        file_size = len(content)
        
        if file_size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
            logger.warning(f"⚠️  Skipping {file.filename} - exceeds size limit")
            continue
        
        # Save file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{idx}_{file.filename}"
        file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
        
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        logger.info(f"  💾 Saved to: {safe_filename}")
        
        # Process PDF and extract text
        try:
            logger.info(f"  🔍 Extracting text from PDF...")
            chunks = rag_service.process_pdf(file_path)
            text_content = " ".join([chunk.page_content for chunk in chunks])
            
            logger.info(f"  📊 Extracted {len(text_content)} characters")
            
            # Extract skills
            logger.info(f"  🎯 Extracting skills...")
            skills = rag_service.extract_skills(text_content)
            logger.info(f"  ✅ Found {len(skills)} skills: {', '.join(skills[:5])}{'...' if len(skills) > 5 else ''}")
            
            # Extract education
            logger.info(f"  🎓 Extracting education...")
            education = rag_service.extract_education(text_content)
            # Wrap in list to match schema expectation
            education_list = [education] if education else []
            logger.info(f"  ✅ Education: {education.get('degree', 'Not found') if education else 'Not found'}")
            
            # Extract experience
            logger.info(f"  💼 Extracting experience...")
            experience = rag_service.extract_experience(text_content)
            logger.info(f"  ✅ Experience: {experience.get('years', 'Not found')} years")
            
            # Extract contact information (name, email, phone)
            logger.info(f"  📧 Extracting contact information...")
            contact_info = rag_service.extract_contact_info(text_content)
            logger.info(f"  ✅ Contact: Name={contact_info.get('name', 'Not found')}, Email={contact_info.get('email', 'Not found')}")
            
            # Add to vector store
            logger.info(f"  🔢 Adding to vector store...")
            rag_service.add_to_vector_store(chunks)
            
        except Exception as e:
            logger.error(f"  ❌ Error processing {file.filename}: {str(e)}")
            os.remove(file_path)
            continue
        
        # Create resume record
        resume = Resume(
            user_id=current_user.id,
            job_id=job.id,
            candidate_name=contact_info.get('name'),
            candidate_email=contact_info.get('email'),
            candidate_phone=contact_info.get('phone'),
            file_name=file.filename,
            file_path=file_path,
            file_size=file_size,
            text_content=text_content,
            extracted_skills=skills,
            extracted_education=education_list,  # Store education as list
            extracted_experience=experience,
            status="processed"
        )
        
        db.add(resume)
        db.commit()
        db.refresh(resume)
        
        uploaded_resumes.append(resume)
        resume_texts[resume.id] = text_content
        
        logger.info(f"  ✅ Resume saved (ID: {resume.id})")
    
    logger.info(f"\n✅ STEP 1 COMPLETE: {len(uploaded_resumes)} resumes processed")
    
    if len(uploaded_resumes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid resumes were uploaded"
        )
    
    # STEP 2: Run RAG Pipeline - FAISS Search + Reranking
    logger.info("\n" + "=" * 80)
    logger.info("STEP 2: RUNNING RAG PIPELINE (FAISS + RERANKING)")
    logger.info("=" * 80)
    
    # Build job query
    requirements_text = "\n".join(job.requirements) if job.requirements else ""
    job_query = f"{job.title}\n{job.description}\nRequirements:\n{requirements_text}"
    
    logger.info(f"🔍 Job Query Length: {len(job_query)} characters")
    
    # Run complete RAG pipeline with ranking
    logger.info(f"\n🤖 Running RAG pipeline...")
    logger.info(f"  - FAISS search for top {min(50, len(uploaded_resumes))} candidates")
    logger.info(f"  - CrossEncoder reranking")
    logger.info(f"  - Selecting top {top_n} candidates")
    
    try:
        ranked_results = rag_service.rank_resumes_with_summaries(
            job_description=job_query,
            resume_texts=resume_texts,
            top_k=min(50, len(uploaded_resumes)),
            top_n=top_n
        )
        
        logger.info(f"\n✅ STEP 2 COMPLETE: {len(ranked_results)} candidates ranked")
        
    except Exception as e:
        logger.error(f"❌ RAG pipeline failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ranking failed: {str(e)}"
        )
    
    # STEP 3: Store Match Results with LLM Summaries
    logger.info("\n" + "=" * 80)
    logger.info("STEP 3: STORING RANKED RESULTS")
    logger.info("=" * 80)
    
    for rank, result in enumerate(ranked_results, 1):
        resume_id = result['resume_id']
        score = result['score']
        summary = result['summary']
        skills = result.get('skills', [])  # Get skills from result
        
        logger.info(f"\n🏆 Rank #{rank}")
        logger.info(f"  Resume ID: {resume_id}")
        logger.info(f"  Score: {score:.4f}")
        logger.info(f"  Summary: {summary}")
        logger.info(f"  Skills: {', '.join(skills) if skills else 'No skills extracted'}")
        
        # Create match record with skills from result
        match = Match(
            job_id=job.id,
            resume_id=resume_id,
            match_score=int(score * 100),  # Convert to percentage
            skills_match={"matched_skills": skills},  # Use skills from RAG result
            summary=summary,
            status="ranked"
        )
        
        db.add(match)
    
    db.commit()
    logger.info(f"\n✅ STEP 3 COMPLETE: {len(ranked_results)} matches stored")
    
    # Create notification
    create_notification(
        db=db,
        user_id=current_user.id,
        title="Resume Ranking Complete",
        message=f"Ranked top {len(ranked_results)} candidates for '{job.title}'",
        notification_type="match",
        link=f"/analytics"
    )
    
    logger.info("\n" + "=" * 80)
    logger.info("✅ UPLOAD AND RANK PIPELINE COMPLETED SUCCESSFULLY")
    logger.info("=" * 80)
    logger.info(f"📊 Total Resumes: {len(uploaded_resumes)}")
    logger.info(f"🏆 Top Ranked: {len(ranked_results)}")
    logger.info(f"💼 Job ID: {job.id}")
    logger.info("=" * 80 + "\n")
    
    return {
        "message": f"Successfully ranked {len(ranked_results)} out of {len(uploaded_resumes)} resumes",
        "job_id": job.id,
        "total_resumes": len(uploaded_resumes),
        "ranked_count": len(ranked_results),
        "top_candidates": [
            {
                "rank": idx + 1,
                "resume_id": r['resume_id'],
                "score": r['score'],
                "summary": r['summary']
            }
            for idx, r in enumerate(ranked_results)
        ]
    }


# Keep existing upload endpoint for backward compatibility
@router.post("/upload", response_model=List[FileUploadResponse])
async def upload_resumes(
    files: List[UploadFile] = File(...),
    job_id: Optional[int] = Form(None),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Upload one or more resume files"""
    
    logger.info(f"📤 Upload request received: {len(files)} files, job_id={job_id}")
    
    # For demo purposes, if no user is authenticated, create a demo user
    if not current_user:
        if not settings.ENABLE_DEMO_MODE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
            
        # Get or create demo user
        demo_user = db.query(User).filter(User.email == "demo@example.com").first()
        if not demo_user:
            from app.auth import get_password_hash
            demo_user = User(
                email="demo@example.com",
                username="demo",
                hashed_password=get_password_hash("demo123"),
                full_name="Demo User",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
        current_user = demo_user
    
    uploaded_files = []
    
    for file in files:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only PDF files are allowed. {file.filename} is not a PDF."
            )
        
        # Validate file size
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File {file.filename} exceeds maximum size of {settings.MAX_FILE_SIZE_MB}MB"
            )
        
        # Create unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        # Process PDF and extract text
        try:
            chunks = rag_service.process_pdf(file_path)
            text_content = " ".join([chunk.page_content for chunk in chunks])
            
            # Extract skills using RAG
            skills = rag_service.extract_skills(text_content)
            
            # Extract education
            education = rag_service.extract_education(text_content)
            # Wrap in list to match schema expectation
            education_list = [education] if education else []
            logger.info(f"  🎓 Education extracted: {education.get('degree', 'Not found') if education else 'Not found'}")
            
            # Extract contact information (name, email, phone)
            contact_info = rag_service.extract_contact_info(text_content)
            logger.info(f"  📧 Contact info extracted: Name={contact_info.get('name', 'Not found')}, Email={contact_info.get('email', 'Not found')}")
            
            # Add to vector store
            rag_service.add_to_vector_store(chunks)
            
        except Exception as e:
            # Clean up file if processing fails
            logger.error(f"❌ Error processing {file.filename}: {str(e)}")
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error processing {file.filename}: {str(e)}"
            )
        
        # Create resume record
        logger.info(f"💾 Creating resume record for {file.filename}")
        resume = Resume(
            user_id=current_user.id,
            job_id=job_id,
            candidate_name=contact_info.get('name'),
            candidate_email=contact_info.get('email'),
            candidate_phone=contact_info.get('phone'),
            file_name=file.filename,
            file_path=file_path,
            file_size=file_size,
            text_content=text_content,
            extracted_skills=skills,
            extracted_education=education_list,  # Store education as list
            status="processed"
        )
        
        db.add(resume)
        db.commit()
        db.refresh(resume)
        
        logger.info(f"✅ Successfully processed {file.filename} (Resume ID: {resume.id})")
        uploaded_files.append(FileUploadResponse(
            file_name=file.filename,
            file_size=file_size,
            status="success",
            message="Resume uploaded and processed successfully"
        ))
    
    logger.info(f"✨ Upload complete: {len(uploaded_files)} files processed successfully")
    return uploaded_files



def get_or_create_demo_user(db: Session):
    """Helper to get or create the demo user"""
    demo_user = db.query(User).filter(User.email == "demo@example.com").first()
    if not demo_user:
        from app.auth import get_password_hash
        demo_user = User(
            email="demo@example.com",
            username="demo",
            hashed_password=get_password_hash("demo123"),
            full_name="Demo User",
            is_active=True
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
    return demo_user


@router.get("/", response_model=List[ResumeResponse])
def get_resumes(
    skip: int = 0,
    limit: int = 100,
    job_id: Optional[int] = None,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Get all resumes for current user, ordered by most recent first"""
    
    # Handle authentication (demo mode support)
    if not current_user:
        if not settings.ENABLE_DEMO_MODE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        current_user = get_or_create_demo_user(db)

    query = db.query(Resume).filter(Resume.user_id == current_user.id)
    
    if job_id:
        query = query.filter(Resume.job_id == job_id)
    
    # Order by created_at descending (most recent first)
    resumes = query.order_by(Resume.created_at.desc()).offset(skip).limit(limit).all()
    return resumes


@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific resume"""
    
    # Handle authentication (demo mode support)
    if not current_user:
        if not settings.ENABLE_DEMO_MODE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        current_user = get_or_create_demo_user(db)

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Extract contact info if missing (for old resumes)
    if not resume.candidate_name and resume.text_content:
        try:
            contact_info = rag_service.extract_contact_info(resume.text_content)
            if contact_info.get('name'):
                resume.candidate_name = contact_info.get('name')
            if not resume.candidate_email and contact_info.get('email'):
                resume.candidate_email = contact_info.get('email')
            if not resume.candidate_phone and contact_info.get('phone'):
                resume.candidate_phone = contact_info.get('phone')
            db.commit()
            db.refresh(resume)
        except Exception as e:
            logger.warning(f"Failed to extract contact info for resume {resume_id}: {e}")
    
    return resume


@router.get("/{resume_id}/download")
def download_resume(
    resume_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Download/view a resume PDF file"""
    
    # Handle authentication (demo mode support)
    if not current_user:
        if not settings.ENABLE_DEMO_MODE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        current_user = get_or_create_demo_user(db)

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    if not os.path.exists(resume.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file not found on server"
        )
    
    return FileResponse(
        path=resume.file_path,
        media_type="application/pdf",
        filename=resume.file_name,
        headers={
            "Content-Disposition": f'inline; filename="{resume.file_name}"'
        }
    )


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Delete a resume"""
    
    # Handle authentication (demo mode support)
    if not current_user:
        if not settings.ENABLE_DEMO_MODE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        current_user = get_or_create_demo_user(db)

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Delete file
    if os.path.exists(resume.file_path):
        os.remove(resume.file_path)
    
    # Delete database record
    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"}


@router.get("/{resume_id}/matches", response_model=List[MatchResponse])
def get_resume_matches(
    resume_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Get all matches for a specific resume"""
    
    # Handle authentication (demo mode support)
    if not current_user:
        if not settings.ENABLE_DEMO_MODE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        current_user = get_or_create_demo_user(db)

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    matches = db.query(Match).filter(Match.resume_id == resume_id).all()
    return matches


from pydantic import BaseModel

class CompareRequest(BaseModel):
    resume_id_1: int
    resume_id_2: int


@router.post("/compare")
def compare_resumes(
    request: CompareRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Compare two resumes side-by-side with detailed analysis.
    
    Returns:
    - Basic info for both candidates
    - Skill comparison (common vs unique)
    - Experience comparison
    - Education comparison
    - Match scores (if available)
    - Cosine similarity
    - Recommendation
    """
    
    # Handle authentication (demo mode support)
    if not current_user:
        if not settings.ENABLE_DEMO_MODE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        current_user = get_or_create_demo_user(db)
    
    import re
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    import numpy as np
    
    resume_id_1 = request.resume_id_1
    resume_id_2 = request.resume_id_2
    
    logger.info(f"📊 Comparing resumes: {resume_id_1} vs {resume_id_2}")
    
    # Fetch both resumes
    resume_1 = db.query(Resume).filter(
        Resume.id == resume_id_1,
        Resume.user_id == current_user.id
    ).first()
    
    resume_2 = db.query(Resume).filter(
        Resume.id == resume_id_2,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume_1:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume {resume_id_1} not found"
        )
    
    if not resume_2:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume {resume_id_2} not found"
        )
    
    # Get match scores if available
    match_1 = db.query(Match).filter(Match.resume_id == resume_id_1).first()
    match_2 = db.query(Match).filter(Match.resume_id == resume_id_2).first()
    
    # Extract candidate names from text or filename
    def extract_name(resume):
        if hasattr(resume, 'candidate_name') and resume.candidate_name:
            return resume.candidate_name
        return resume.file_name.replace('.pdf', '').replace('_', ' ').title()
    
    # Extract experience from text using regex
    def extract_experience(resume):
        # First check extracted_experience JSON
        if resume.extracted_experience:
            if isinstance(resume.extracted_experience, dict):
                years = resume.extracted_experience.get('years')
                if years:
                    return f"{years} years"
            elif isinstance(resume.extracted_experience, list):
                return f"{len(resume.extracted_experience)} positions"
        
        # Fallback: parse from text using RAG service
        try:
            exp_data = rag_service.extract_experience(resume.text_content)
            if exp_data and 'years' in exp_data:
                return f"{exp_data['years']} years"
        except Exception:
            pass
            
        return "Not specified"
    
    # Extract education from JSON or text
    def extract_education(resume):
        # First check extracted_education JSON
        if resume.extracted_education:
            if isinstance(resume.extracted_education, dict):
                degree = resume.extracted_education.get('degree')
                if degree and degree != "Not specified":
                    # Expand abbreviations
                    degree = degree.replace("Ms", "Master's")
                    degree = degree.replace("ms.", "Master's")
                    degree = degree.replace("M.S", "Master's")
                    degree = degree.replace("Bs", "Bachelor's")
                    degree = degree.replace("bs.", "Bachelor's")
                    degree = degree.replace("B.S", "Bachelor's")
                    return degree
            elif isinstance(resume.extracted_education, list) and len(resume.extracted_education) > 0:
                degree = resume.extracted_education[0].get('degree', 'Not specified')
                # Expand abbreviations
                degree = degree.replace("Ms", "Master's")
                degree = degree.replace("ms.", "Master's")
                return degree
        
        # Fallback: parse from text with better patterns
        text = resume.text_content
        
        # Comprehensive degree patterns
        degree_patterns = [
            # PhD patterns
            (r'(?:ph\.?d\.?|doctor\s+of\s+philosophy|doctorate)\s+(?:in\s+)?([a-zA-Z\s&]+?)(?:\s+from|\s+at|\s+-|\s+\||,|\n|$)', "PhD"),
            # Master's patterns - more comprehensive
            (r'(?:m\.?s\.?c?\.?|master(?:\'s)?(?:\s+of\s+science)?|m\.?tech\.?|m\.?eng\.?|mba|m\.?b\.?a\.?)\s+(?:in\s+|of\s+)?([a-zA-Z\s&]+?)(?:\s+from|\s+at|\s+-|\s+\||,|\n|$)', "Master's"),
            # Bachelor's patterns
            (r'(?:b\.?s\.?c?\.?|bachelor(?:\'s)?(?:\s+of\s+science)?|b\.?tech\.?|b\.?eng\.?|b\.?e\.?)\s+(?:in\s+|of\s+)?([a-zA-Z\s&]+?)(?:\s+from|\s+at|\s+-|\s+\||,|\n|$)', "Bachelor's"),
            # Associate/Diploma
            (r'(associate|diploma)\s+(?:in\s+|of\s+)?([a-zA-Z\s&]+?)(?:\s+from|\s+at|\s+-|\s+\||,|\n|$)', "Associate"),
        ]
        
        for pattern, degree_type in degree_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                if match.groups():
                    field = match.group(1).strip()
                    # Clean up field
                    field = re.sub(r'\s+(from|at|in|of|and)$', '', field, flags=re.IGNORECASE)
                    field = field.strip()
                    if field and len(field) > 2:  # Valid field name
                        return f"{degree_type} in {field.title()}"
                return degree_type
        
        return "Not specified"
    
    # Calculate cosine similarity between resume texts
    def calculate_cosine_similarity(text1, text2):
        try:
            vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
            tfidf_matrix = vectorizer.fit_transform([text1, text2])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return round(similarity * 100, 1)  # Convert to percentage
        except:
            return None
    
    # Skill analysis
    skills_1 = set(resume_1.extracted_skills or [])
    skills_2 = set(resume_2.extracted_skills or [])
    
    common_skills = list(skills_1 & skills_2)
    unique_skills_1 = list(skills_1 - skills_2)
    unique_skills_2 = list(skills_2 - skills_1)
    
    # Calculate skill match percentage
    total_skills = len(skills_1 | skills_2)
    skill_overlap = (len(common_skills) / total_skills * 100) if total_skills > 0 else 0
    
    # Calculate cosine similarity
    cosine_sim = calculate_cosine_similarity(resume_1.text_content, resume_2.text_content)
    
    # Generate recommendation
    recommendation = ""
    if match_1 and match_2:
        score_diff = match_1.match_score - match_2.match_score
        if abs(score_diff) < 5:
            recommendation = "Both candidates are equally matched"
        elif score_diff > 0:
            recommendation = f"Candidate 1 has {abs(round(score_diff))}% higher match score"
        else:
            recommendation = f"Candidate 2 has {abs(round(score_diff))}% higher match score"
    elif cosine_sim and cosine_sim > 70:
        recommendation = "Both candidates have very similar profiles"
    elif len(common_skills) > len(unique_skills_1) and len(common_skills) > len(unique_skills_2):
        recommendation = "Both candidates have similar skill sets"
    elif len(skills_1) > len(skills_2):
        recommendation = "Candidate 1 has more diverse skills"
    else:
        recommendation = "Candidate 2 has more diverse skills"
    
    return {
        "candidate_1": {
            "id": resume_1.id,
            "name": extract_name(resume_1),
            "experience": extract_experience(resume_1),
            "education": extract_education(resume_1),
            "skills": list(skills_1),
            "match_score": round(match_1.match_score, 1) if match_1 else None,  # Round to 1 decimal
            "file_name": resume_1.file_name
        },
        "candidate_2": {
            "id": resume_2.id,
            "name": extract_name(resume_2),
            "experience": extract_experience(resume_2),
            "education": extract_education(resume_2),
            "skills": list(skills_2),
            "match_score": round(match_2.match_score, 1) if match_2 else None,  # Round to 1 decimal
            "file_name": resume_2.file_name
        },
        "comparison": {
            "common_skills": common_skills,
            "unique_skills_1": unique_skills_1,
            "unique_skills_2": unique_skills_2,
            "skill_overlap_percentage": round(skill_overlap, 1),
            "match_score_diff": round(match_1.match_score - match_2.match_score, 1) if (match_1 and match_2) else None,
            "cosine_similarity": cosine_sim,  # NEW: Text similarity
            "recommendation": recommendation
        }
    }
