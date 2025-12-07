from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_db
from app.models import Resume, Job, User
from app.auth import get_optional_current_user
from app.config import settings

router = APIRouter(prefix="/search", tags=["Search"])

class SearchResult(BaseModel):
    id: int
    type: str  # 'resume' or 'job'
    title: str
    subtitle: Optional[str] = None
    link: str

class SearchResponse(BaseModel):
    results: List[SearchResult]

@router.get("/", response_model=SearchResponse)
def search_global(
    q: str = Query(..., min_length=2, description="Search query"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Global search for resumes and jobs.
    Returns matching candidates and job postings.
    """
    # Demo/Auth check
    if not current_user and not settings.ENABLE_DEMO_MODE:
        # Allow unauthorized search in demo mode, otherwise return empty
        # Or raise 401? Better to just return empty to avoid UI errors before login
        return {"results": []}

    results = []
    
    # 1. Search Jobs
    job_query = db.query(Job)
    if current_user:
        job_query = job_query.filter(Job.user_id == current_user.id)
    
    try:
        jobs = job_query.filter(
            or_(
                Job.title.ilike(f"%{q}%"),
                Job.description.ilike(f"%{q}%"),
                Job.location.ilike(f"%{q}%")
            )
        ).limit(3).all()
        
        for j in jobs:
            results.append(SearchResult(
                id=j.id,
                type="job",
                title=j.title,
                subtitle=j.location or j.job_type or "Job Posting",
                link="/jobs"
            ))
    except Exception:
        pass # Ignore errors if table doesn't exist or other db issues

    # 2. Search Resumes
    resume_query = db.query(Resume)
    if current_user:
        resume_query = resume_query.filter(Resume.user_id == current_user.id)
    
    try:
        # Search by name, file name, or skills
        resumes = resume_query.filter(
            or_(
                Resume.candidate_name.ilike(f"%{q}%"),
                Resume.file_name.ilike(f"%{q}%"),
                Resume.text_content.ilike(f"%{q}%")
            )
        ).limit(5).all()
        
        for r in resumes:
            name = r.candidate_name or r.file_name
            # Provide context for the result
            subtitle = "Candidate"
            if r.extracted_skills and len(r.extracted_skills) > 0:
                subtitle = f"Skills: {', '.join(r.extracted_skills[:3])}..."
            
            results.append(SearchResult(
                id=r.id,
                type="resume",
                title=name,
                subtitle=subtitle,
                link=f"/candidates/{r.id}" # Direct link to candidate detail page
            ))
    except Exception:
        pass

    return {"results": results}
