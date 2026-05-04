from langchain_huggingface import HuggingFaceEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
import pandas as pd
from pathlib import Path
from ..db.mongodb import db_manager
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        # Embeddings are initialized lazily on first use to avoid httpx
        # client lifecycle issues during async server startup.
        self._embeddings = None
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
        self.index_name = "vector_index" # You will need to create this index in Atlas UI

    @property
    def embeddings(self):
        if self._embeddings is None:
            logger.info("Loading HuggingFace embeddings model (all-MiniLM-L6-v2)...")
            self._embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
            logger.info("Embeddings model loaded successfully.")
        return self._embeddings
    
    @property
    def vector_store(self):
        if db_manager.sync_client is None:
            raise Exception("Database not connected")
        collection = db_manager.sync_client["academic_guidance"]["knowledge_base"]
        return MongoDBAtlasVectorSearch(
            collection=collection,
            embedding=self.embeddings,
            index_name=self.index_name,
            text_key="text",
            embedding_key="embedding"
        )

    def _collection(self):
        if db_manager.sync_client is None:
            raise Exception("Database not connected")
        return db_manager.sync_client["academic_guidance"]["knowledge_base"]
        
    def add_documents(self, raw_text: str, metadata: dict):
        """Processes raw text (e.g. from a syllabus or career guide) and saves its meaning into the Vector DB."""
        try:
            logger.info("Splitting text into manageable chunks...")
            chunks = self.text_splitter.split_text(raw_text)
            
            docs = [Document(page_content=chunk, metadata=metadata) for chunk in chunks]
            
            logger.info(f"Adding {len(docs)} document chunks to MongoDB Atlas Vector Search...")
            self.vector_store.add_documents(docs)
            return {"status": "success", "chunks_added": len(docs)}
        except Exception as e:
            logger.error(f"Failed to add documents: {e}")
            raise

    def query_documents(self, query: str, limit: int = 4):
        try:
            results = self.vector_store.similarity_search(query, k=limit)
            return [
                {
                    "content": doc.page_content,
                    "metadata": doc.metadata,
                }
                for doc in results
            ]
        except Exception as e:
            logger.error(f"Failed to query documents: {e}")
            raise

    def seed_from_csv(self, csv_path: str = None):
        try:
            collection = self._collection()
            if collection.count_documents({"metadata.source": "career_content.csv"}) > 0:
                logger.info("Knowledge base already seeded from career_content.csv")
                return {"status": "skipped", "seeded": 0}

            source_path = Path(csv_path or settings.DATA_PATH)
            if not source_path.exists():
                logger.warning(f"Knowledge seed file not found: {source_path}")
                return {"status": "missing_file", "seeded": 0}

            frame = pd.read_csv(source_path)
            documents = []
            for _, row in frame.iterrows():
                career = str(row.get("career", "Career Guidance")).strip()
                content = (
                    f"Career: {career}\n"
                    f"Beginner: {row.get('beginner', '')}\n"
                    f"Intermediate: {row.get('intermediate', '')}\n"
                    f"Advanced: {row.get('advanced', '')}\n"
                    f"Projects: {row.get('projects', '')}\n"
                    f"Tools: {row.get('tools', '')}"
                )
                documents.append(Document(page_content=content, metadata={
                    "source": "career_content.csv",
                    "career": career,
                    "type": "career_catalog",
                }))

            if documents:
                logger.info(f"Seeding {len(documents)} career knowledge documents into MongoDB Atlas Vector Search...")
                self.vector_store.add_documents(documents)
            return {"status": "success", "seeded": len(documents)}
        except Exception as e:
            logger.error(f"Failed to seed knowledge base: {e}")
            raise

try:
    rag_service = RAGService()
except Exception as e:
    logger.error(f"Failed to initialize RAGService: {e}")
    rag_service = None
