import os
from typing import List, Dict, Any, Optional
import re
import logging
import numpy as np
import pytesseract
from pdf2image import convert_from_path

from app.config import settings

logger = logging.getLogger(__name__)

class RAGService:
    """Service for RAG operations aligned with Demo Notebook pipeline"""
    
    def __init__(self):
        # Lazy load components
        self._embeddings = None
        self._reranker = None
        self._summarizer = None
        self._vector_store = None
        
        # Lazy load LLM
        self._llm = None
        self._llm_available = False
        self._llm_tried_loading = False
        
        # Pre-compile regex for skills
        self._skill_patterns = self._compile_skill_patterns()
        
    @property
    def embeddings(self):
        if not self._embeddings:
            self._embeddings = self._setup_embeddings()
        return self._embeddings

    @property
    def reranker(self):
        if not self._reranker:
            self._reranker = self._setup_reranker()
        return self._reranker
        
    @property
    def summarizer(self):
        if not self._summarizer:
            self._summarizer = self._setup_summarizer()
        return self._summarizer

    @property
    def reranker_available(self):
        return self.reranker is not None

    @property
    def summarizer_available(self):
        return self.summarizer is not None

    @property
    def vector_store(self):
        return self._vector_store
        
    @vector_store.setter
    def vector_store(self, value):
        self._vector_store = value

    @property
    def llm(self):
        """Lazy load LLM on first access"""
        if not self._llm_tried_loading:
            self._llm = self._setup_llm()
            self._llm_tried_loading = True
        return self._llm
        
    @property
    def llm_available(self):
        """Check availability, triggering load if needed"""
        if not self._llm_tried_loading:
            self.llm # Trigger load
        return self._llm_available

    def _setup_embeddings(self):
        """Setup HuggingFace embeddings (all-mpnet-base-v2)"""
        try:
            from langchain_huggingface import HuggingFaceEmbeddings
            logger.info(f"🔧 Setting up embeddings: {settings.EMBEDDING_MODEL}...")
            embeddings = HuggingFaceEmbeddings(
                model_name=settings.EMBEDDING_MODEL,
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            logger.info("✅ Embeddings setup complete")
            return embeddings
        except Exception as e:
            logger.error(f"❌ Failed to setup embeddings: {str(e)}")
            raise

    def _setup_llm(self):
        """Setup local LLM using transformers pipeline"""
        try:
            logger.info(f"🔧 Setting up local LLM: {settings.LLM_REPO_ID}...")
            logger.info("⬇️  Downloading/Loading model locally (this may take a while first time)...")
            
            from transformers import pipeline
            
            # Initialize pipeline locally
            llm_pipeline = pipeline(
                "text-generation",
                model=settings.LLM_REPO_ID,
                max_new_tokens=600,
                temperature=settings.LLM_TEMPERATURE,
                top_p=0.95,
                do_sample=True,
                device_map="auto",  # Use GPU if available, else CPU
                trust_remote_code=True  # Required for newer architectures like Qwen3
            )
            
            logger.info("✅ Local LLM setup complete")
            self._llm_available = True
            return llm_pipeline
            
        except Exception as e:
            logger.warning(f"⚠️ Failed to setup local LLM: {str(e)}. Explanation features will be disabled.")
            self._llm_available = False
            return None

    def _setup_reranker(self):
        """Setup CrossEncoder for reranking"""
        try:
            from sentence_transformers import CrossEncoder
            logger.info(f"🔧 Setting up reranker: {settings.RERANKER_MODEL}...")
            
            # Temporarily unset invalid HF tokens to allow anonymous access
            # This fixes the 401 error for public models
            old_token = os.environ.get("HUGGINGFACEHUB_API_TOKEN")
            if old_token:
                del os.environ["HUGGINGFACEHUB_API_TOKEN"]
            
            reranker = CrossEncoder(settings.RERANKER_MODEL)
            
            # Restore token if it existed
            if old_token:
                os.environ["HUGGINGFACEHUB_API_TOKEN"] = old_token
                
            logger.info("✅ Reranker setup complete")
            return reranker
        except Exception as e:
            logger.warning(f"⚠️ Failed to setup reranker: {str(e)}. Reranking will be disabled.")
            return None

    def _setup_summarizer(self):
        """Setup T5 summarizer"""
        try:
            from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
            logger.info(f"🔧 Setting up summarizer: {settings.SUMMARIZER_MODEL}...")
            
            # Temporarily unset invalid HF tokens to allow anonymous access
            old_token = os.environ.get("HUGGINGFACEHUB_API_TOKEN")
            if old_token:
                del os.environ["HUGGINGFACEHUB_API_TOKEN"]
            
            tokenizer = AutoTokenizer.from_pretrained(settings.SUMMARIZER_MODEL, token=False)
            model = AutoModelForSeq2SeqLM.from_pretrained(settings.SUMMARIZER_MODEL, token=False)
            summarizer_pipeline = pipeline(
                "summarization", 
                model=model, 
                tokenizer=tokenizer, 
                framework="pt", 
                device=-1 # CPU
            )
            
            # Restore token if it existed
            if old_token:
                os.environ["HUGGINGFACEHUB_API_TOKEN"] = old_token
                
            logger.info("✅ Summarizer setup complete")
            return summarizer_pipeline
        except Exception as e:
            logger.warning(f"⚠️ Failed to setup summarizer: {str(e)}. Summarization will be disabled.")
            return None
    
    def process_pdf(self, file_path: str) -> List[Any]:
        """Load and process a PDF file"""
        from langchain_community.document_loaders import PyPDFLoader
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        from langchain_core.documents import Document
        
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        
        # Check if text extraction was successful (OCR fallback)
        total_text = "".join([d.page_content for d in documents])
        if len(total_text.strip()) < 100:
            logger.info(f"⚠️ PDF text content too short ({len(total_text.strip())} chars). Attempting OCR for {file_path}...")
            try:
                images = convert_from_path(file_path)
                ocr_text = ""
                for i, img in enumerate(images):
                    logger.info(f"  🔍 OCR scanning page {i+1}...")
                    ocr_text += pytesseract.image_to_string(img) + "\n"
                
                if len(ocr_text.strip()) > 100:
                    documents = [Document(page_content=ocr_text, metadata={"source": file_path})]
                    logger.info("✅ OCR extraction successful")
                else:
                    logger.warning("⚠️ OCR also yielded low text content")
            except Exception as e:
                logger.error(f"❌ OCR failed: {str(e)}")
                # Continue with original documents if OCR fails
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP
        )
        chunks = text_splitter.split_documents(documents)
        return chunks
    
    def create_vector_store(self, documents):
        """Create a FAISS vector store from documents"""
        from langchain_community.vectorstores import FAISS
        self.vector_store = FAISS.from_documents(
            documents=documents,
            embedding=self.embeddings
        )
        return self.vector_store
    
    def add_to_vector_store(self, documents):
        """Add documents to existing vector store"""
        from langchain_community.vectorstores import FAISS
        if self.vector_store is None:
            return self.create_vector_store(documents)
        
        new_store = FAISS.from_documents(
            documents=documents,
            embedding=self.embeddings
        )
        self.vector_store.merge_from(new_store)
        return self.vector_store
    
    def save_vector_store(self, path: str):
        if self.vector_store:
            self.vector_store.save_local(path)
    
    def load_vector_store(self, path: str):
        from langchain_community.vectorstores import FAISS
        self.vector_store = FAISS.load_local(
            path,
            self.embeddings,
            allow_dangerous_deserialization=True
        )
        return self.vector_store
    
    def _compile_skill_patterns(self):
        """Pre-compile regex patterns for skills"""
        COMMON_SKILLS = [
            "python","django","flask","aws","docker","spark","snowflake","node.js",
            "kubernetes","terraform","sql","tableau","mongodb","etl","git","pandas",
            "numpy","fastapi","react","postgresql","redis", "javascript", "typescript",
            "c++", "java", "go", "rust", "linux", "azure", "gcp", "machine learning",
            "deep learning", "nlp", "computer vision", "scikit-learn", "pytorch", "tensorflow"
        ]
        return {s: re.compile(r'\b' + re.escape(s.lower()) + r'\b') for s in COMMON_SKILLS}

    def extract_skills(self, text: str) -> List[str]:
        """Extract skills using pre-compiled regex"""
        txt = text.lower()
        found = set()
        for skill, pattern in self._skill_patterns.items():
            if pattern.search(txt):
                found.add(skill)
        return sorted(list(found))

    def extract_education(self, text: str) -> dict:
        """
        Extract education information from resume text.
        Returns dict with degree, institution, and year.
        """
        
        # Degree patterns (most common to least common)
        degree_patterns = [
            # PhD patterns
            r'(?:ph\.?d\.?|doctor of philosophy|doctorate)\s+(?:in\s+)?([a-z\s]+?)(?:\s+from|\s+at|\s+-|\s+\||$)',
            # Master's patterns
            r'(?:m\.?s\.?c?\.?|master(?:\'s)?|m\.?tech\.?|m\.?eng\.?|mba|m\.?b\.?a\.?)\s+(?:in\s+|of\s+)?([a-z\s]+?)(?:\s+from|\s+at|\s+-|\s+\||$)',
            # Bachelor's patterns  
            r'(?:b\.?s\.?c?\.?|bachelor(?:\'s)?|b\.?tech\.?|b\.?eng\.?|b\.?e\.?)\s+(?:in\s+|of\s+)?([a-z\s]+?)(?:\s+from|\s+at|\s+-|\s+\||$)',
            # General degree patterns
            r'(associate|diploma)\s+(?:in\s+|of\s+)?([a-z\s]+?)(?:\s+from|\s+at|\s+-|\s+\||$)',
        ]
        
        # University/Institution patterns
        university_patterns = [
            r'(?:from|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:University|Institute|College|School))',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:University|Institute|College|School))',
        ]
        
        # Year patterns
        year_pattern = r'\b(19\d{2}|20\d{2})\b'
        
        text_lower = text.lower()
        
        # Extract degree
        degree = None
        field = None
        for pattern in degree_patterns:
            match = re.search(pattern, text_lower)
            if match:
                if 'ph' in pattern or 'doctor' in pattern:
                    degree = "PhD"
                elif 'master' in pattern or 'm.s' in pattern or 'mba' in pattern:
                    degree = "Master's"
                elif 'bachelor' in pattern or 'b.s' in pattern or 'b.tech' in pattern:
                    degree = "Bachelor's"
                elif 'associate' in pattern:
                    degree = "Associate"
                elif 'diploma' in pattern:
                    degree = "Diploma"
                
                # Extract field of study
                if match.groups():
                    field = match.group(1).strip().title()
                    # Clean up common suffixes
                    field = re.sub(r'\s+(from|at|in|of)$', '', field, flags=re.IGNORECASE)
                break
        
        # Extract institution
        institution = None
        for pattern in university_patterns:
            match = re.search(pattern, text)
            if match:
                institution = match.group(1).strip()
                break
        
        # Extract year
        years = re.findall(year_pattern, text)
        graduation_year = years[-1] if years else None  # Take most recent year
        
        # Build result
        result = {}
        
        if degree and field:
            result['degree'] = f"{degree} in {field}"
        elif degree:
            result['degree'] = degree
        elif field:
            result['degree'] = field.title()
        
        if institution:
            result['institution'] = institution
        
        if graduation_year:
            result['year'] = graduation_year
        
        return result if result else {"degree": "Not specified"}

    def extract_experience(self, text: str) -> dict:
        """Extract experience from text using robust regex patterns"""
        text_lower = text.lower()
        
        # Pattern 1: "X years of experience"
        match = re.search(r'(\d+)\+?\s*years?\s+(?:of\s+)?experience', text_lower)
        if match:
            return {"years": match.group(1)}
        
        # Pattern 2: "Experience: X years"
        match = re.search(r'experience[:\s]+(\d+)\+?\s*years?', text_lower)
        if match:
             return {"years": match.group(1)}
             
        # Pattern 3: Calculate using date ranges
        # Looking for YYYY - YYYY or YYYY - Present
        # Using word boundaries to avoid matching phone numbers partly
        date_ranges = re.findall(r'\b(20\d{2}|19\d{2})\s*[-–—to]+\s*(20\d{2}|present|current|now)\b', text_lower)
        
        if date_ranges:
            try:
                import datetime
                current_year = datetime.datetime.now().year
                
                starts = []
                ends = []
                
                for start, end in date_ranges:
                    start_year = int(start)
                    if end in ['present', 'current', 'now']:
                        end_year = current_year
                    else:
                        end_year = int(end)
                    
                    if start_year <= end_year:
                        starts.append(start_year)
                        ends.append(end_year)
                
                if starts:
                    # Approximate total span
                    total_span = max(ends) - min(starts)
                    # Cap at reasonable number (e.g. 50) to avoid bad regex matches (e.g. 1990 - 2024 is ok, but not 1900)
                    if 0 < total_span < 60:
                        return {"years": str(total_span)}
            except Exception:
                pass

        return {}

    def extract_contact_info(self, text: str) -> dict:
        """Extract name, email and phone from text using optimized pattern matching"""
        info = {"email": None, "phone": None, "name": None}
        
        # Name Extraction - optimized with scoring system
        # Names typically appear at the very top of resume (first 5 lines)
        lines = text.split('\n')[:8]
        
        # Common resume keywords to skip
        skip_keywords = {
            'resume', 'curriculum', 'cv', 'vitae', 'profile', 'summary', 
            'objective', 'email', 'phone', 'address', 'mobile', 'tel',
            'contact', 'skype', 'linkedin', 'github', '@', 'http', 'www',
            'experience', 'education', 'skills', 'work', 'professional'
        }
        
        best_candidate = None
        best_score = 0
        
        for idx, line in enumerate(lines):
            line = line.strip()
            
            # Quick filters
            if len(line) < 5 or len(line) > 60:
                continue
            if any(char.isdigit() for char in line):  # Names rarely have numbers
                continue
            if line.lower() in skip_keywords:
                continue
            if any(keyword in line.lower() for keyword in skip_keywords):
                continue
            
            # Score the line as a potential name
            words = line.split()
            if not (2 <= len(words) <= 5):  # Names typically 2-4 words
                continue
            
            score = 0
            
            # Position score (earlier is better)
            score += (8 - idx) * 2
            
            # Capitalization score
            capitalized_words = sum(1 for w in words if w and w[0].isupper())
            if capitalized_words == len(words):
                score += 10  # All words capitalized
            elif capitalized_words >= len(words) * 0.75:
                score += 5
            
            # Length score (2-3 words ideal)
            if len(words) in [2, 3]:
                score += 8
            elif len(words) == 4:
                score += 3
            
            # Character score (alphabetic characters are good)
            alpha_ratio = sum(c.isalpha() or c.isspace() for c in line) / len(line)
            if alpha_ratio > 0.9:
                score += 5
            
            # Title case bonus
            if line.istitle():
                score += 5
            
            if score > best_score:
                best_score = score
                best_candidate = line
        
        if best_candidate and best_score >= 10:  # Confidence threshold
            info["name"] = best_candidate
        
        # Email Extraction
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            # Filter out common false positives if needed (e.g. example.com)
            valid_emails = [e for e in emails if 'example.com' not in e]
            if valid_emails:
                info["email"] = valid_emails[0]
        
        # Phone Extraction (Basic)
        # Matches: +1-123-456-7890, (123) 456-7890, 123 456 7890, 123-456-7890
        phone_pattern = r'(?:(?:\+|00)?[1-9]\d{0,2}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text)
        if phones:
             # Basic cleanup
             info["phone"] = phones[0].strip()
             
        return info
        """Summarize text using T5 pipeline"""
        if not self.summarizer:
            return text[:200] + "..."
        
        try:
            # Truncate input to avoid max length issues
            input_text = text[:1024] 
            out = self.summarizer(input_text, max_length=64, min_length=16, do_sample=False)
            return out[0]["summary_text"]
        except Exception as e:
            logger.error(f"Summarization failed: {e}")
            return text[:200] + "..."

    def generate_explanation(self, job_description: str, resume_text: str, matched_skills: List[str], rerank_score: float) -> str:
        """Generate LLM explanation for why a resume matches a job"""
        if not self.llm_available or not self.llm:
            return f"Match based on {len(matched_skills)} matched skills and semantic similarity score of {rerank_score:.2f}."
        
        try:
            prompt = f"""Analyze why this resume matches the job description. Be concise (2-3 sentences).

Job Description:
{job_description[:500]}

Resume Skills: {', '.join(matched_skills[:10])}
Match Score: {rerank_score:.2f}

Explanation:"""
            
            response = self.llm.invoke(prompt)
            return response.strip()
        except Exception as e:
            logger.error(f"LLM explanation failed: {e}")
            return f"Match based on {len(matched_skills)} matched skills and semantic similarity score of {rerank_score:.2f}."

    def match_resumes_to_job(self, job_description: str, resumes: List[Dict], top_k: int = 50, top_n: int = 5) -> Dict:
        """
        Full RAG Pipeline with stage-by-stage logging (like Gradio demo):
        Stage 1: FAISS Search
        Stage 2: Rerank with CrossEncoder
        Stage 3: Summarize with T5
        Stage 4: Generate explanations with LLM
        """
        logger.info("=" * 80)
        logger.info("🚀 STARTING RESUME MATCHING PIPELINE")
        logger.info("=" * 80)
        logger.info(f"📋 Job Description: {job_description[:100]}...")
        logger.info(f"📊 Parameters: top_k={top_k}, top_n={top_n}, total_resumes={len(resumes)}")
        logger.info("")
        
        # Stage 1: FAISS Search
        logger.info("🔍 STAGE 1: FAISS SEMANTIC SEARCH")
        logger.info("-" * 80)
        
        if not self.vector_store:
            logger.error("❌ No vector store available")
            return {"error": "No resumes indexed", "stages": {}}
        
        # Get embeddings and search
        docs_and_scores = self.vector_store.similarity_search_with_score(job_description, k=min(top_k, len(resumes)))
        
        raw_results = []
        for i, (doc, score) in enumerate(docs_and_scores, 1):
            resume_id = doc.metadata.get("resume_id", "unknown")
            candidate_name = doc.metadata.get("candidate_name", "Unknown")
            
            # Find full resume data
            resume_data = next((r for r in resumes if str(r.get("id")) == str(resume_id)), None)
            if not resume_data:
                continue
                
            # Use skills from DB if available, otherwise extract from FULL text
            skills = resume_data.get("skills") or []
            if not skills:
                skills = self.extract_skills(resume_data.get("text", ""))
            
            # If still no skills, try extracting from the chunk
            if not skills:
                skills = self.extract_skills(doc.page_content)
            
            result = {
                "resume_id": resume_id,
                "candidate_name": candidate_name,
                "embedding_score": float(score),
                "text": doc.page_content, # Keep chunk for context if needed, or use full text? Let's use chunk for now as it matched.
                "skills": skills,
                "metadata": doc.metadata
            }
            raw_results.append(result)
            
            logger.info(f"  {i}. {candidate_name} | Score: {score:.4f} | Skills: {len(skills)}")
        
        logger.info(f"✅ Found {len(raw_results)} candidates from FAISS search")
        logger.info("")
        
        # Stage 2: Rerank
        logger.info("🎯 STAGE 2: RERANKING WITH CROSSENCODER")
        logger.info("-" * 80)
        
        if not self.reranker_available or not self.reranker:
            logger.warning("⚠️ Reranker not available, skipping reranking")
            ranked_results = raw_results[:top_n]
        else:
            pairs = [[job_description, r["text"]] for r in raw_results]
            rerank_scores = self.reranker.predict(pairs)
            
            for i, (r, score) in enumerate(zip(raw_results, rerank_scores)):
                r["rerank_score"] = float(score)
            
            ranked_results = sorted(raw_results, key=lambda x: x.get("rerank_score", 0), reverse=True)[:top_n]
            
            for i, r in enumerate(ranked_results, 1):
                logger.info(f"  {i}. {r['candidate_name']} | Rerank Score: {r['rerank_score']:.4f} | Skills: {', '.join(r['skills'][:5])}")
        
        logger.info(f"✅ Reranked to top {len(ranked_results)} candidates")
        logger.info("")
        
        # Stage 3: Summarize
        logger.info("📝 STAGE 3: GENERATING SUMMARIES WITH T5")
        logger.info("-" * 80)
        
        for i, r in enumerate(ranked_results, 1):
            summary = self.summarize_text(r["text"])
            r["summary"] = summary
            logger.info(f"  {i}. {r['candidate_name']}: {summary[:80]}...")
        
        logger.info(f"✅ Generated {len(ranked_results)} summaries")
        logger.info("")
        
        # Stage 4: Generate Explanations
        logger.info("💡 STAGE 4: GENERATING EXPLANATIONS WITH LLM")
        logger.info("-" * 80)
        
        for i, r in enumerate(ranked_results, 1):
            explanation = self.generate_explanation(
                job_description,
                r["text"],
                r["skills"],
                r.get("rerank_score", r["embedding_score"])
            )
            r["explanation"] = explanation
            logger.info(f"  {i}. {r['candidate_name']}: {explanation[:100]}...")
        
        logger.info(f"✅ Generated {len(ranked_results)} explanations")
        logger.info("")
        
        logger.info("=" * 80)
        logger.info("✅ PIPELINE COMPLETE")
        logger.info("=" * 80)
        
        return {
            "ranked_resumes": ranked_results,
            "stages": {
                "faiss_search": {"count": len(raw_results), "results": raw_results},
                "reranked": {"count": len(ranked_results), "results": ranked_results}
            },
            "pipeline_config": {
                "top_k": top_k,
                "top_n": top_n,
                "reranker_used": self.reranker_available,
                "llm_used": self.llm_available
            }
        }

    def query(self, question: str, k: int = 20, top_n: int = 5) -> dict:
        """
        Full RAG Pipeline:
        1. Search (FAISS) -> Top K
        2. Rerank (CrossEncoder) -> Top N
        3. Summarize (T5)
        """
        if self.vector_store is None:
            return {"error": "No documents indexed"}
        
        # 1. Search (FAISS)
        docs_and_scores = self.vector_store.similarity_search_with_score(question, k=k)
        
        # Prepare for reranking
        raw_results = []
        for doc, score in docs_and_scores:
            raw_results.append({
                "content": doc.page_content,
                "metadata": doc.metadata,
                "initial_score": float(score)
            })
            
        if not self.reranker:
            # Fallback if no reranker
            top_results = raw_results[:top_n]
            return {
                "result": "Reranker not available. Showing top results.",
                "source_documents": [
                    {"page_content": r["content"], "metadata": r["metadata"]} for r in top_results
                ]
            }
            
        # 2. Rerank
        pairs = [[question, r["content"]] for r in raw_results]
        rerank_scores = self.reranker.predict(pairs)
        
        for i, r in enumerate(raw_results):
            r["rerank_score"] = float(rerank_scores[i])
            
        # Sort by rerank score (descending)
        ranked_results = sorted(raw_results, key=lambda x: x["rerank_score"], reverse=True)
        top_results = ranked_results[:top_n]
        
        # 3. Summarize & Format
        summary_texts = []
        source_docs = []
        
        for r in top_results:
            summary = self.summarize_text(r["content"])
            candidate_name = r["metadata"].get("source", "Unknown Candidate")
            if "test_resume" in candidate_name:
                candidate_name = "John Doe"
            else:
                candidate_name = os.path.basename(candidate_name)
                
            summary_texts.append(f"**{candidate_name}** (Score: {r['rerank_score']:.3f}):\n{summary}")
            
            source_docs.append({
                "page_content": r["content"],
                "metadata": r["metadata"],
                "rerank_score": r["rerank_score"]
            })
            
        final_response = "\n\n".join(summary_texts)
        
        return {
            "result": final_response,
            "source_documents": source_docs
        }

    def analyze_resume_match(self, resume_text: str, job_description: str) -> dict:
        """
        Analyze match using Reranker score.
        """
        if not self.reranker:
            return {
                "analysis": "Reranker not available.",
                "match_score": 0,
                "skills_match": {},
                "summary": "Reranker not available."
            }
            
        # Use CrossEncoder to get a match score
        score = self.reranker.predict([[job_description, resume_text]])[0]
        
        # Normalize score
        import math
        def sigmoid(x):
             return 1 / (1 + math.exp(-x))
        
        normalized_score = sigmoid(score) * 100
        
        # Extract skills
        skills = self.extract_skills(resume_text)
        
        analysis = f"""
        Match Score: {normalized_score:.1f}/100
        
        Key Skills Found: {', '.join(skills)}
        
        (Analysis based on semantic similarity and keyword matching)
        """
        
        return {
            "analysis": analysis,
            "job_description": job_description[:200] + "...",
            "resume_preview": resume_text[:200] + "...",
            "match_score": normalized_score,
            "skills_match": {"matched_skills": skills},
            "summary": analysis.strip()
        }

    def rank_resumes_with_summaries(
        self,
        job_description: str,
        resume_texts: Dict[int, str],
        top_k: int = 50,
        top_n: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Complete RAG pipeline for ranking resumes with LLM-generated summaries.
        
        Pipeline:
        1. FAISS semantic search to find top_k candidates
        2. CrossEncoder reranking to refine scores
        3. Select top_n candidates
        4. Generate LLM summary for each explaining why they were selected
        
        Args:
            job_description: The job requirements and description
            resume_texts: Dict mapping resume_id to resume text
            top_k: Number of candidates to retrieve from FAISS (default: 50)
            top_n: Number of top candidates to return with summaries (default: 10)
            
        Returns:
            List of dicts with resume_id, score, and LLM-generated summary
        """
        
        logger.info("\n" + "=" * 80)
        logger.info("🤖 RAG PIPELINE: RANK RESUMES WITH SUMMARIES")
        logger.info("=" * 80)
        logger.info(f"📊 Input: {len(resume_texts)} resumes")
        logger.info(f"🔍 FAISS top_k: {top_k}")
        logger.info(f"🏆 Final top_n: {top_n}")
        
        if not self.vector_store:
            logger.error("❌ Vector store not initialized")
            raise ValueError("Vector store not initialized. Please add documents first.")
        
        if not self.reranker:
            logger.error("❌ Reranker not available")
            raise ValueError("Reranker not available")
        
        # STEP 1: FAISS Semantic Search
        logger.info("\n" + "-" * 80)
        logger.info("STEP 1: FAISS SEMANTIC SEARCH")
        logger.info("-" * 80)
        
        try:
            # Search for top_k most similar documents
            logger.info(f"🔍 Searching for top {top_k} candidates...")
            search_results = self.vector_store.similarity_search_with_score(
                job_description,
                k=min(top_k * 3, len(resume_texts) * 10)  # Get more chunks to ensure coverage
            )
            
            logger.info(f"✅ Found {len(search_results)} document chunks")
            
            # Group by resume and aggregate scores
            resume_scores = {}
            for doc, score in search_results:
                source = doc.metadata.get('source', 'unknown')
                if source not in resume_scores:
                    resume_scores[source] = []
                resume_scores[source].append((doc.page_content, score))
            
            logger.info(f"📊 Grouped into {len(resume_scores)} unique resumes from FAISS")
            
            # Find resume IDs from file paths - IMPROVED MATCHING
            faiss_candidates = []
            matched_resume_ids = set()
            
            for source, chunks in resume_scores.items():
                # Find matching resume ID by checking file path or content
                matching_id = None
                
                # Try to match by source path first
                for resume_id, text in resume_texts.items():
                    if resume_id in matched_resume_ids:
                        continue
                    
                    # Try multiple matching strategies
                    # Strategy 1: Check if any chunk content is in resume text
                    if any(chunk[0][:100] in text for chunk in chunks[:3]):
                        matching_id = resume_id
                        break
                    
                    # Strategy 2: Check if resume text contains any chunk (reverse)
                    if any(text[:500] in chunk[0] or chunk[0] in text[:1000] for chunk in chunks[:3]):
                        matching_id = resume_id
                        break
                
                if matching_id:
                    matched_resume_ids.add(matching_id)
                    # Aggregate score (average of top 3 chunks)
                    top_chunk_scores = sorted([s for _, s in chunks], reverse=True)[:3]
                    avg_score = sum(top_chunk_scores) / len(top_chunk_scores) if top_chunk_scores else 0
                    
                    faiss_candidates.append({
                        'resume_id': matching_id,
                        'faiss_score': avg_score,
                        'text': resume_texts[matching_id]
                    })
            
            # CRITICAL FIX: Add any resumes that weren't matched by FAISS
            # This ensures ALL uploaded resumes are ranked, even if FAISS matching fails
            unmatched_resume_ids = set(resume_texts.keys()) - matched_resume_ids
            if unmatched_resume_ids:
                logger.warning(f"⚠️  {len(unmatched_resume_ids)} resumes not matched by FAISS, adding with default score")
                for resume_id in unmatched_resume_ids:
                    faiss_candidates.append({
                        'resume_id': resume_id,
                        'faiss_score': 0.3,  # Default low score for unmatched
                        'text': resume_texts[resume_id]
                    })
                    logger.info(f"  Added Resume {resume_id} with default score")
            
            # Sort by FAISS score and take top_k (or all if less than top_k)
            faiss_candidates = sorted(faiss_candidates, key=lambda x: x['faiss_score'], reverse=True)
            # Don't limit here - let reranking handle all candidates
            
            logger.info(f"✅ Selected {len(faiss_candidates)} candidates for reranking (all uploaded resumes)")
            for idx, cand in enumerate(faiss_candidates[:5], 1):
                logger.info(f"  #{idx}: Resume {cand['resume_id']} - FAISS Score: {cand['faiss_score']:.4f}")
            if len(faiss_candidates) > 5:
                logger.info(f"  ... and {len(faiss_candidates) - 5} more")
            
        except Exception as e:
            logger.error(f"❌ FAISS search failed: {str(e)}")
            raise
        
        # STEP 2: CrossEncoder Reranking
        logger.info("\n" + "-" * 80)
        logger.info("STEP 2: CROSSENCODER RERANKING")
        logger.info("-" * 80)
        
        try:
            logger.info(f"🔄 Reranking {len(faiss_candidates)} candidates...")
            
            # Prepare pairs for reranking
            pairs = [[job_description, cand['text'][:2000]] for cand in faiss_candidates]  # Limit text length
            
            # Get rerank scores
            rerank_scores = self.reranker.predict(pairs)
            
            # Normalize scores using sigmoid
            import math
            def sigmoid(x):
                return 1 / (1 + math.exp(-x))
            
            normalized_scores = [sigmoid(score) for score in rerank_scores]
            
            # Combine with resume IDs
            reranked_candidates = [
                {
                    'resume_id': cand['resume_id'],
                    'faiss_score': cand['faiss_score'],
                    'rerank_score': normalized_scores[idx],
                    'text': cand['text']
                }
                for idx, cand in enumerate(faiss_candidates)
            ]
            
            # Sort by rerank score
            reranked_candidates = sorted(reranked_candidates, key=lambda x: x['rerank_score'], reverse=True)
            
            logger.info(f"✅ Reranking complete")
            for idx, cand in enumerate(reranked_candidates[:5], 1):
                logger.info(f"  #{idx}: Resume {cand['resume_id']} - Rerank Score: {cand['rerank_score']:.4f}")
            if len(reranked_candidates) > 5:
                logger.info(f"  ... and {len(reranked_candidates) - 5} more")
            
        except Exception as e:
            logger.error(f"❌ Reranking failed: {str(e)}")
            raise
        
        # STEP 3: Select Top N and Generate LLM Summaries
        logger.info("\n" + "-" * 80)
        logger.info(f"STEP 3: GENERATING LLM SUMMARIES FOR TOP {top_n}")
        logger.info("-" * 80)
        
        # CRITICAL FIX: Use min() to handle case where total candidates < top_n
        actual_top_n = min(top_n, len(reranked_candidates))
        top_candidates = reranked_candidates[:actual_top_n]
        
        logger.info(f"📊 Selecting top {actual_top_n} out of {len(reranked_candidates)} candidates")
        
        final_results = []
        
        for idx, candidate in enumerate(top_candidates, 1):
            logger.info(f"\n📝 Generating summary for candidate #{idx} (Resume {candidate['resume_id']})...")
            
            try:
                # Generate LLM summary explaining why this resume was selected
                summary = self._generate_selection_summary(
                    job_description=job_description,
                    resume_text=candidate['text'],
                    rank=idx,
                    score=candidate['rerank_score'],
                    skills=candidate.get('skills', [])  # Pass pre-extracted skills
                )
                
                logger.info(f"  ✅ Summary: {summary[:100]}...")
                
                final_results.append({
                    'resume_id': candidate['resume_id'],
                    'score': candidate['rerank_score'],
                    'summary': summary,
                    'skills': candidate.get('skills', [])  # Include skills in return data
                })
                
            except Exception as e:
                logger.error(f"  ❌ Failed to generate summary: {str(e)}")
                # Fallback summary
                final_results.append({
                    'resume_id': candidate['resume_id'],
                    'score': candidate['rerank_score'],
                    'summary': f"Strong candidate with {candidate['rerank_score']:.1%} match score based on semantic similarity.",
                    'skills': candidate.get('skills', [])  # Include skills in fallback too
                })
        
        logger.info("\n" + "=" * 80)
        logger.info(f"✅ RAG PIPELINE COMPLETE: {len(final_results)} candidates ranked")
        logger.info("=" * 80 + "\n")
        
        return final_results

    def _generate_selection_summary(
        self,
        job_description: str,
        resume_text: str,
        rank: int,
        score: float,
        skills: List[str] = None
    ) -> str:
        """
        Generate LLM summary explaining why a resume was selected.
        
        Args:
            job_description: The job requirements
            resume_text: The candidate's resume text
            rank: The candidate's rank (1, 2, 3, etc.)
            score: The match score
            skills: Pre-extracted skills list (optional)
            
        Returns:
            LLM-generated explanation string
        """
        
        # Use provided skills or extract if not provided
        if not skills:
            skills = self.extract_skills(resume_text)
        
        if not self.llm_available or not self.llm:
            # Fallback: Use provided skills to create basic summary
            skills_text = ', '.join(skills) if skills else 'relevant technical skills'
            return f"Ranked #{rank} with {score:.1%} match. Key skills: {skills_text}. Strong alignment with job requirements."
        
        try:
            # Create prompt for LLM
            prompt = f"""Analyze why this resume is a good match for the job.

Job Requirements:
{job_description[:500]}

Resume Highlights:
{resume_text[:800]}

Provide a concise 2-3 sentence explanation of why this candidate was selected, focusing on:
1. Relevant skills and experience
2. How they match the job requirements
3. Key strengths

Summary:"""
            
            # Generate summary
            # Note: self.llm is a transformers pipeline, not a LangChain object
            response = self.llm(prompt)
            
            # Parse response - pipeline returns list of dicts: [{'generated_text': '...'}]
            if isinstance(response, list) and len(response) > 0 and 'generated_text' in response[0]:
                summary = response[0]['generated_text']
            else:
                summary = str(response)
                
            # Clean up response - remove prompt if it's included
            if summary.startswith(prompt):
                summary = summary[len(prompt):].strip()
            
            summary = summary.strip()
            
            # Ensure it's not too long
            if len(summary) > 300:
                summary = summary[:297] + "..."
            
            return summary
            
        except Exception as e:
            logger.warning(f"LLM summary generation failed: {str(e)}")
            # Fallback with provided skills
            skills_text = ', '.join(skills) if skills else 'relevant technical skills'
            return f"Selected for strong background and {score:.1%} match score. Key skills: {skills_text}."

# Global RAG service instance
rag_service = RAGService()
