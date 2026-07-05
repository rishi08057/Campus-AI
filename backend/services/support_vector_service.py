import os
import chromadb
import logging
from typing import List, Dict, Any
from google import genai
from google.genai import types

logger = logging.getLogger("backend.support_vector_service")

class SupportVectorService:
    def __init__(self):
        # Initialize ChromaDB at the same database directory
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.collection = self.client.get_or_create_collection(name="support_knowledge")
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not found")
        
        # Initialize the latest google-genai Client
        self.genai_client = genai.Client(api_key=api_key)
        
        # Consistent with rag_service.py embedding model
        self.model_name = "gemini-embedding-2"

    def _get_embedding(self, text: str) -> List[float]:
        """
        Generate embeddings using the latest google-genai SDK.
        Handles the 2026 model suite and provides failover logic.
        """
        try:
            # Using the flagship gemini-embedding-2 model
            response = self.genai_client.models.embed_content(
                model=self.model_name,
                contents=text,
                config=types.EmbedContentConfig(
                    task_type="RETRIEVAL_QUERY"
                )
            )
            return response.embeddings[0].values
        
        except Exception as e:
            error_str = str(e).lower()
            if "404" in error_str or "not found" in error_str:
                logger.warning(f"Model {self.model_name} not found. Falling back to stable text-embedding-004.")
                try:
                    # Fallback to text-embedding-004
                    response = self.genai_client.models.embed_content(
                        model="text-embedding-004",
                        contents=text,
                        config=types.EmbedContentConfig(
                            task_type="RETRIEVAL_QUERY"
                        )
                    )
                    return response.embeddings[0].values
                except Exception as fallback_error:
                    # Final fallback to gemini-embedding-001
                    logger.warning(f"text-embedding-004 also failed. Falling back to gemini-embedding-001.")
                    response = self.genai_client.models.embed_content(
                        model="gemini-embedding-001",
                        contents=text
                    )
                    return response.embeddings[0].values
            
            logger.error(f"Embedding error: {e}")
            raise e

    def index_documents(self, documents: List[Dict[str, Any]]):
        """Index support documents into the vector database."""
        if not documents:
            return

        ids = []
        embeddings = []
        metadatas = []
        docs = []

        for doc in documents:
            # Create a rich text representation for embedding
            content = doc.get("content", "")
            category = doc.get("category", "")
            title = doc.get("title", "")
            
            text_content = f"Category: {category}\nTitle: {title}\nContent: {content}"
            
            ids.append(str(doc.get("id")))
            embeddings.append(self._get_embedding(text_content))
            
            # Formulate metadata
            meta = {
                "category": category,
                "title": title
            }
            # Add nested metadata if it exists
            if "metadata" in doc and isinstance(doc["metadata"], dict):
                for k, v in doc["metadata"].items():
                    if isinstance(v, (str, int, float, bool)):
                        meta[k] = v
                    else:
                        # Convert complex metadata values to string for ChromaDB compatibility
                        meta[k] = str(v)
            
            metadatas.append(meta)
            docs.append(text_content)

        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=docs
        )
        logger.info(f"Indexed {len(documents)} support documents into ChromaDB.")

    def search_documents(self, query: str, n_results: int = 3) -> List[Dict[str, Any]]:
        """Find the most relevant support documents for a query."""
        try:
            query_embedding = self._get_embedding(query)
            
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results
            )

            formatted_results = []
            if results['ids'] and results['ids'][0]:
                for i in range(len(results['ids'][0])):
                    formatted_results.append({
                        "id": results['ids'][0][i],
                        "content": results['documents'][0][i],
                        "metadata": results['metadatas'][0][i]
                    })
            
            return formatted_results
        except Exception as e:
            logger.error(f"Support search error: {e}")
            return []

# Create a singleton instance
support_vector_service = SupportVectorService()
