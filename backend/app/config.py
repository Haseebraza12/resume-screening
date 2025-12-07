from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # API Settings
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "ResumeMatch AI"
    ENVIRONMENT: str = "development"
    ENABLE_DEMO_MODE: bool = True
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str
    
    # Hugging Face
    HUGGINGFACEHUB_API_TOKEN: str = os.getenv("HUGGINGFACEHUB_API_TOKEN", "")
    
    # Vector Store
    VECTOR_STORE: str = "faiss"  # faiss, pinecone, weaviate
    PINECONE_API_KEY: str = ""
    PINECONE_ENVIRONMENT: str = ""
    PINECONE_INDEX_NAME: str = "resumematch"
    PINECONE_HOST: str = ""
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # CORS Configuration
    # In development: allow all localhost/127.0.0.1 origins (any port)
    # In production: set CORS_ORIGINS environment variable with specific domains
    CORS_ALLOW_ALL_LOCALHOST: bool = True  # Set to False in production
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002"
    ]
    
    # File Upload
    MAX_FILE_SIZE_MB: int = 10
    UPLOAD_DIR: str = "./uploads"
    
    # LLM Settings (for explanations and summaries)
    LLM_REPO_ID: str = "google/gemma-3-270m-it"  # Updated to Gemma 3 270M
    LLM_MAX_LENGTH: int = 512
    LLM_TEMPERATURE: float = 0.7
    
    # Embeddings & RAG Models (Matched with Demo Notebook)
    EMBEDDING_MODEL: str = "sentence-transformers/all-mpnet-base-v2"
    RERANKER_MODEL: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    SUMMARIZER_MODEL: str = "t5-small"
    
    # Text Splitting
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 150
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in .env


settings = Settings()
