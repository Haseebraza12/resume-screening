import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

# Create figure with a modern, professional look
fig, ax = plt.subplots(figsize=(20, 16))
ax.set_xlim(0, 14)
ax.set_ylim(0, 16)
ax.axis('off')

# Define a professional color palette
color_bg = '#FFFFFF'
color_input = '#E3F2FD'      # Light Blue - User/Input
color_frontend = '#E8EAF6'   # Light Indigo - Frontend
color_api = '#F3E5F5'        # Light Purple - API Layer
color_rag = '#FFF3E0'        # Light Orange - RAG Pipeline
color_models = '#FFEBEE'     # Light Red - AI Models
color_storage = '#E8F5E9'    # Light Green - Storage
color_output = '#E0F7FA'     # Cyan - Output
color_text = '#263238'       # Dark Slate Grey
color_border = '#455A64'     # Blue Grey

# Title
ax.text(7, 15.5, 'Rankify - Resume Screening RAG Pipeline', 
        ha='center', va='center', fontsize=24, fontweight='bold', color=color_text)
ax.text(7, 15.1, 'FAISS Retrieval • CrossEncoder Reranking • LLM Generation', 
        ha='center', va='center', fontsize=13, style='italic', color='#546E7A')


# ============================================================================
# ROW 1: USER & FRONTEND
# ============================================================================

# User
user_box = FancyBboxPatch((0.5, 12.8), 2.5, 1.2, boxstyle="round,pad=0.1,rounding_size=0.2", 
                          edgecolor=color_border, facecolor=color_input, linewidth=2)
ax.add_patch(user_box)
ax.text(1.75, 13.5, 'Recruiter', ha='center', va='center', fontsize=12, fontweight='bold', color=color_text)
ax.text(1.75, 13.15, 'Uploads PDFs +', ha='center', va='center', fontsize=9, color=color_text)
ax.text(1.75, 12.95, 'Job Description', ha='center', va='center', fontsize=9, color=color_text)

# Frontend
frontend_box = FancyBboxPatch((4.0, 12.3), 4.0, 1.7, boxstyle="round,pad=0.1,rounding_size=0.2",
                               edgecolor=color_border, facecolor=color_frontend, linewidth=2)
ax.add_patch(frontend_box)
ax.text(6.0, 13.65, 'Frontend (Next.js 15)', ha='center', va='center', fontsize=12, fontweight='bold', color=color_text)
ax.text(6.0, 13.35, 'Framework: React 18 + TypeScript', ha='center', va='center', fontsize=9, fontweight='bold', color='#3949AB')
ax.text(6.0, 13.1, '• Dashboard, Upload, Analytics Pages', ha='center', va='center', fontsize=8, color=color_text)
ax.text(6.0, 12.9, '• Recharts Visualizations', ha='center', va='center', fontsize=8, color=color_text)
ax.text(6.0, 12.7, '• Tailwind CSS + Radix UI', ha='center', va='center', fontsize=8, color=color_text)
ax.text(6.0, 12.5, '• Axios API Client (7 modules)', ha='center', va='center', fontsize=8, color=color_text)

# Arrow User -> Frontend
ax.add_patch(FancyArrowPatch((3.0, 13.4), (4.0, 13.4), arrowstyle='->', mutation_scale=18, color=color_border, linewidth=2))

# ============================================================================
# ROW 2: BACKEND API LAYER
# ============================================================================

# FastAPI Backend
api_box = FancyBboxPatch((4.0, 9.8), 6.0, 2.0, boxstyle="round,pad=0.1,rounding_size=0.2",
                         edgecolor=color_border, facecolor=color_api, linewidth=2)
ax.add_patch(api_box)
ax.text(7.0, 11.45, 'Backend API (FastAPI 0.115)', ha='center', va='center', fontsize=12, fontweight='bold', color=color_text)
ax.text(7.0, 11.15, 'Server: Uvicorn ASGI | Auth: JWT + Bcrypt', ha='center', va='center', fontsize=9, fontweight='bold', color='#7B1FA2')

# API Routers (inside API box)
ax.text(5.0, 10.75, '/resumes', ha='center', va='center', fontsize=8, family='monospace', color='#4527A0',
        bbox=dict(boxstyle='round,pad=0.2', facecolor='#EDE7F6', edgecolor='#B39DDB'))
ax.text(6.2, 10.75, '/analytics', ha='center', va='center', fontsize=8, family='monospace', color='#4527A0',
        bbox=dict(boxstyle='round,pad=0.2', facecolor='#EDE7F6', edgecolor='#B39DDB'))
ax.text(7.4, 10.75, '/chat', ha='center', va='center', fontsize=8, family='monospace', color='#4527A0',
        bbox=dict(boxstyle='round,pad=0.2', facecolor='#EDE7F6', edgecolor='#B39DDB'))
ax.text(8.4, 10.75, '/jobs', ha='center', va='center', fontsize=8, family='monospace', color='#4527A0',
        bbox=dict(boxstyle='round,pad=0.2', facecolor='#EDE7F6', edgecolor='#B39DDB'))
ax.text(9.3, 10.75, '/auth', ha='center', va='center', fontsize=8, family='monospace', color='#4527A0',
        bbox=dict(boxstyle='round,pad=0.2', facecolor='#EDE7F6', edgecolor='#B39DDB'))

ax.text(7.0, 10.3, '12 API Routers | Pydantic Validation | SQLAlchemy ORM', ha='center', va='center', fontsize=8, color=color_text)
ax.text(7.0, 10.05, 'Key Endpoint: POST /resumes/upload-and-rank', ha='center', va='center', fontsize=8, style='italic', color='#546E7A')

# Arrow Frontend -> API
ax.add_patch(FancyArrowPatch((6.0, 12.3), (7.0, 11.8), arrowstyle='->', mutation_scale=18, color=color_border, linewidth=2))
ax.text(6.8, 12.1, 'REST API', ha='center', va='center', fontsize=8, color='#546E7A')

# ============================================================================
# ROW 3: RAG PIPELINE (4 STAGES)
# ============================================================================

# Stage 1: Ingestion
stage1_box = FancyBboxPatch((0.5, 6.5), 3.0, 2.8, boxstyle="round,pad=0.1,rounding_size=0.2",
                            edgecolor=color_border, facecolor=color_rag, linewidth=2)
ax.add_patch(stage1_box)
ax.text(2.0, 9.0, 'Stage 1: Ingestion', ha='center', va='center', fontsize=11, fontweight='bold', color=color_text)
ax.text(2.0, 8.7, 'PDF Processing', ha='center', va='center', fontsize=9, fontweight='bold', color='#E65100')
ax.text(2.0, 8.45, '• PyPDFLoader (Text)', ha='center', va='center', fontsize=8, color=color_text)
ax.text(2.0, 8.25, '• Tesseract OCR (Scanned)', ha='center', va='center', fontsize=8, color=color_text)
ax.text(2.0, 7.95, 'Text Chunking', ha='center', va='center', fontsize=9, fontweight='bold', color='#E65100')
ax.text(2.0, 7.7, '• Chunk: 1000 chars', ha='center', va='center', fontsize=8, color=color_text)
ax.text(2.0, 7.5, '• Overlap: 150 chars', ha='center', va='center', fontsize=8, color=color_text)
ax.text(2.0, 7.2, 'Regex Extraction', ha='center', va='center', fontsize=9, fontweight='bold', color='#E65100')
ax.text(2.0, 6.95, '• Skills (30+ patterns)', ha='center', va='center', fontsize=8, color=color_text)
ax.text(2.0, 6.75, '• Experience, Education', ha='center', va='center', fontsize=8, color=color_text)

# Stage 2: FAISS Search
stage2_box = FancyBboxPatch((4.0, 6.5), 3.0, 2.8, boxstyle="round,pad=0.1,rounding_size=0.2",
                            edgecolor=color_border, facecolor=color_rag, linewidth=2)
ax.add_patch(stage2_box)
ax.text(5.5, 9.0, 'Stage 2: Retrieval', ha='center', va='center', fontsize=11, fontweight='bold', color=color_text)
ax.text(5.5, 8.7, 'Vector Search', ha='center', va='center', fontsize=9, fontweight='bold', color='#E65100')
ax.text(5.5, 8.45, '• Library: FAISS (CPU)', ha='center', va='center', fontsize=8, color=color_text)
ax.text(5.5, 8.25, '• Metric: Cosine Similarity', ha='center', va='center', fontsize=8, color=color_text)
ax.text(5.5, 7.95, 'Embedding Model', ha='center', va='center', fontsize=9, fontweight='bold', color='#E65100')
ax.text(5.5, 7.7, 'all-mpnet-base-v2', ha='center', va='center', fontsize=8, family='monospace', color=color_text)
ax.text(5.5, 7.5, '• 768-dim vectors', ha='center', va='center', fontsize=8, color=color_text)
ax.text(5.5, 7.2, 'Selection', ha='center', va='center', fontsize=9, fontweight='bold', color='#E65100')
ax.text(5.5, 6.95, '• Top-K = 50 candidates', ha='center', va='center', fontsize=8, color=color_text)
ax.text(5.5, 6.75, '• Aggregated chunk scores', ha='center', va='center', fontsize=8, color=color_text)

# Stage 3: Reranking
stage3_box = FancyBboxPatch((7.5, 6.5), 3.0, 2.8, boxstyle="round,pad=0.1,rounding_size=0.2",
                            edgecolor=color_border, facecolor=color_rag, linewidth=2)
ax.add_patch(stage3_box)
ax.text(9.0, 9.0, 'Stage 3: Reranking', ha='center', va='center', fontsize=11, fontweight='bold', color=color_text)
ax.text(9.0, 8.7, 'Neural Reranker', ha='center', va='center', fontsize=9, fontweight='bold', color='#E65100')
ax.text(9.0, 8.45, '• Library: sentence-transformers', ha='center', va='center', fontsize=8, color=color_text)
ax.text(9.0, 8.25, '• Cross-Encoder Architecture', ha='center', va='center', fontsize=8, color=color_text)
ax.text(9.0, 7.95, 'Model', ha='center', va='center', fontsize=9, fontweight='bold', color='#E65100')
ax.text(9.0, 7.7, 'ms-marco-MiniLM-L-6-v2', ha='center', va='center', fontsize=8, family='monospace', color=color_text)
ax.text(9.0, 7.5, '• Pairwise (JD, Resume)', ha='center', va='center', fontsize=8, color=color_text)
ax.text(9.0, 7.2, 'Normalization', ha='center', va='center', fontsize=9, fontweight='bold', color='#E65100')
ax.text(9.0, 6.95, '• Sigmoid → 0-100%', ha='center', va='center', fontsize=8, color=color_text)
ax.text(9.0, 6.75, '• Top-N = 5 selected', ha='center', va='center', fontsize=8, color=color_text)

# Stage 4: Generation
stage4_box = FancyBboxPatch((11.0, 6.5), 2.5, 2.8, boxstyle="round,pad=0.1,rounding_size=0.2",
                            edgecolor=color_border, facecolor=color_rag, linewidth=2)
ax.add_patch(stage4_box)
ax.text(12.25, 9.0, 'Stage 4: Generation', ha='center', va='center', fontsize=11, fontweight='bold', color=color_text)
ax.text(12.25, 8.65, 'Summarizer', ha='center', va='center', fontsize=9, fontweight='bold', color='#E65100')
ax.text(12.25, 8.4, 'T5-small', ha='center', va='center', fontsize=8, family='monospace', color=color_text)
ax.text(12.25, 8.2, '• Abstractive Summary', ha='center', va='center', fontsize=8, color=color_text)
ax.text(12.25, 7.85, 'Explanation LLM', ha='center', va='center', fontsize=9, fontweight='bold', color='#E65100')
ax.text(12.25, 7.6, 'Gemma-3-270M-IT', ha='center', va='center', fontsize=8, family='monospace', color=color_text)
ax.text(12.25, 7.4, '• Why candidate fits', ha='center', va='center', fontsize=8, color=color_text)
ax.text(12.25, 7.2, '• Prompt Engineering', ha='center', va='center', fontsize=8, color=color_text)
ax.text(12.25, 6.95, '• Local GPU/CPU', ha='center', va='center', fontsize=8, color=color_text)

# Arrows between RAG stages
ax.add_patch(FancyArrowPatch((3.5, 7.9), (4.0, 7.9), arrowstyle='->', mutation_scale=15, color=color_border, linewidth=2))
ax.add_patch(FancyArrowPatch((7.0, 7.9), (7.5, 7.9), arrowstyle='->', mutation_scale=15, color=color_border, linewidth=2))
ax.add_patch(FancyArrowPatch((10.5, 7.9), (11.0, 7.9), arrowstyle='->', mutation_scale=15, color=color_border, linewidth=2))

# Arrow API -> RAG Pipeline
ax.add_patch(FancyArrowPatch((7.0, 9.8), (7.0, 9.3), arrowstyle='->', mutation_scale=18, color=color_border, linewidth=2))
ax.text(7.3, 9.55, 'rag_service.py', ha='left', va='center', fontsize=8, family='monospace', color='#546E7A')

# ============================================================================
# ROW 4: STORAGE LAYER
# ============================================================================

# PostgreSQL Database
db_box = FancyBboxPatch((0.5, 3.5), 4.0, 2.5, boxstyle="round,pad=0.1,rounding_size=0.2",
                        edgecolor=color_border, facecolor=color_storage, linewidth=2)
ax.add_patch(db_box)
ax.text(2.5, 5.7, 'PostgreSQL Database', ha='center', va='center', fontsize=11, fontweight='bold', color=color_text)
ax.text(2.5, 5.4, 'ORM: SQLAlchemy 2.0', ha='center', va='center', fontsize=9, fontweight='bold', color='#2E7D32')
ax.text(2.5, 5.1, '7 Models:', ha='center', va='center', fontsize=9, color=color_text)
ax.text(2.5, 4.85, '• User, Job, Resume', ha='center', va='center', fontsize=8, color=color_text)
ax.text(2.5, 4.65, '• Match, Skill', ha='center', va='center', fontsize=8, color=color_text)
ax.text(2.5, 4.45, '• Notification, Favorite', ha='center', va='center', fontsize=8, color=color_text)
ax.text(2.5, 4.15, 'Stores: Profiles, Jobs, Scores', ha='center', va='center', fontsize=8, style='italic', color='#546E7A')
ax.text(2.5, 3.9, 'extracted_skills (JSON)', ha='center', va='center', fontsize=8, family='monospace', color='#1B5E20')
ax.text(2.5, 3.7, 'extracted_experience (JSON)', ha='center', va='center', fontsize=8, family='monospace', color='#1B5E20')

# FAISS Vector Store
faiss_box = FancyBboxPatch((5.0, 3.5), 4.0, 2.5, boxstyle="round,pad=0.1,rounding_size=0.2",
                           edgecolor=color_border, facecolor=color_storage, linewidth=2)
ax.add_patch(faiss_box)
ax.text(7.0, 5.7, 'FAISS Vector Store', ha='center', va='center', fontsize=11, fontweight='bold', color=color_text)
ax.text(7.0, 5.4, 'Library: faiss-cpu 1.9.0', ha='center', va='center', fontsize=9, fontweight='bold', color='#2E7D32')
ax.text(7.0, 5.1, 'Storage:', ha='center', va='center', fontsize=9, color=color_text)
ax.text(7.0, 4.85, '• Resume chunk embeddings', ha='center', va='center', fontsize=8, color=color_text)
ax.text(7.0, 4.65, '• 768-dim dense vectors', ha='center', va='center', fontsize=8, color=color_text)
ax.text(7.0, 4.45, '• Local disk persistence', ha='center', va='center', fontsize=8, color=color_text)
ax.text(7.0, 4.15, 'Operations:', ha='center', va='center', fontsize=9, color=color_text)
ax.text(7.0, 3.9, '• similarity_search_with_score()', ha='center', va='center', fontsize=8, family='monospace', color='#1B5E20')
ax.text(7.0, 3.7, '• Approximate NN Search', ha='center', va='center', fontsize=8, color=color_text)

# File Storage
file_box = FancyBboxPatch((9.5, 3.5), 4.0, 2.5, boxstyle="round,pad=0.1,rounding_size=0.2",
                          edgecolor=color_border, facecolor=color_storage, linewidth=2)
ax.add_patch(file_box)
ax.text(11.5, 5.7, 'File System', ha='center', va='center', fontsize=11, fontweight='bold', color=color_text)
ax.text(11.5, 5.4, 'Local Storage', ha='center', va='center', fontsize=9, fontweight='bold', color='#2E7D32')
ax.text(11.5, 5.1, 'Directories:', ha='center', va='center', fontsize=9, color=color_text)
ax.text(11.5, 4.85, '• /uploads/ (PDF files)', ha='center', va='center', fontsize=8, color=color_text)
ax.text(11.5, 4.65, '• /uploads/avatars/', ha='center', va='center', fontsize=8, color=color_text)
ax.text(11.5, 4.45, '• /vector_stores/ (FAISS)', ha='center', va='center', fontsize=8, color=color_text)
ax.text(11.5, 4.15, 'Limits:', ha='center', va='center', fontsize=9, color=color_text)
ax.text(11.5, 3.9, '• Max: 10MB per file', ha='center', va='center', fontsize=8, color=color_text)
ax.text(11.5, 3.7, '• Format: PDF only', ha='center', va='center', fontsize=8, color=color_text)

# Arrows from RAG to Storage
ax.add_patch(FancyArrowPatch((2.0, 6.5), (2.5, 6.0), arrowstyle='<->', mutation_scale=12, color=color_border, linewidth=1.5, linestyle='dashed'))
ax.add_patch(FancyArrowPatch((5.5, 6.5), (7.0, 6.0), arrowstyle='<->', mutation_scale=12, color=color_border, linewidth=1.5, linestyle='dashed'))
ax.add_patch(FancyArrowPatch((11.5, 6.5), (11.5, 6.0), arrowstyle='<->', mutation_scale=12, color=color_border, linewidth=1.5, linestyle='dashed'))

# ============================================================================
# ROW 5: OUTPUT / RESPONSE
# ============================================================================

# Output Box
output_box = FancyBboxPatch((4.5, 0.8), 5.0, 2.2, boxstyle="round,pad=0.1,rounding_size=0.2",
                            edgecolor=color_border, facecolor=color_output, linewidth=2)
ax.add_patch(output_box)
ax.text(7.0, 2.65, 'Ranked Candidates Response', ha='center', va='center', fontsize=12, fontweight='bold', color=color_text)
ax.text(7.0, 2.35, 'JSON Response Contents:', ha='center', va='center', fontsize=9, fontweight='bold', color='#00838F')
ax.text(7.0, 2.1, '• resume_id, candidate_name', ha='center', va='center', fontsize=8, color=color_text)
ax.text(7.0, 1.9, '• match_score (0-100%)', ha='center', va='center', fontsize=8, color=color_text)
ax.text(7.0, 1.7, '• extracted_skills[], LLM summary', ha='center', va='center', fontsize=8, color=color_text)
ax.text(7.0, 1.5, '• explanation (Why this candidate?)', ha='center', va='center', fontsize=8, color=color_text)
ax.text(7.0, 1.25, 'Displayed in: RankedCandidatesDisplay.tsx', ha='center', va='center', fontsize=8, style='italic', color='#546E7A')
ax.text(7.0, 1.0, 'Visualized: SkillsChart, MatchQualityChart', ha='center', va='center', fontsize=8, style='italic', color='#546E7A')

# Arrow from Stage 4 to Output
ax.add_patch(FancyArrowPatch((12.25, 6.5), (9.5, 2.9), arrowstyle='->', mutation_scale=18, color=color_border, linewidth=2, connectionstyle="arc3,rad=0.2"))

# ============================================================================
# LEGEND / SPECS BOX
# ============================================================================

specs_box = FancyBboxPatch((10.5, 0.8), 3.0, 2.2, boxstyle="round,pad=0.1,rounding_size=0.2",
                           edgecolor=color_border, facecolor='#ECEFF1', linewidth=1.5)
ax.add_patch(specs_box)
ax.text(12.0, 2.7, 'Tech Stack Summary', ha='center', va='center', fontsize=10, fontweight='bold', color=color_text)
ax.text(12.0, 2.4, 'Backend: Python 3.9+', ha='center', va='center', fontsize=8, color=color_text)
ax.text(12.0, 2.2, 'Frontend: Next.js 15', ha='center', va='center', fontsize=8, color=color_text)
ax.text(12.0, 2.0, 'AI: LangChain + HuggingFace', ha='center', va='center', fontsize=8, color=color_text)
ax.text(12.0, 1.8, 'Vector: FAISS (local)', ha='center', va='center', fontsize=8, color=color_text)
ax.text(12.0, 1.6, 'Auth: JWT + Bcrypt', ha='center', va='center', fontsize=8, color=color_text)
ax.text(12.0, 1.35, 'Models:', ha='center', va='center', fontsize=8, fontweight='bold', color=color_text)
ax.text(12.0, 1.15, 'Embed: all-mpnet-base-v2', ha='center', va='center', fontsize=7, color=color_text)
ax.text(12.0, 0.95, 'Rerank: ms-marco-MiniLM', ha='center', va='center', fontsize=7, color=color_text)

plt.tight_layout()
plt.savefig('/home/haseeb-raza/Desktop/resume-screening/system_architecture_diagram.png', dpi=300, bbox_inches='tight', facecolor='white')
print("✓ System architecture diagram saved to system_architecture_diagram.png!")
plt.show()
