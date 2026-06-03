import os
import chromadb
import logging
from typing import List, Dict, Any
from google import genai
from google.genai import types

logger = logging.getLogger("backend.vector_service")

class VectorService:
    def __init__(self):
        # Initialize ChromaDB
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.collection = self.client.get_or_create_collection(name="campus_events")
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not found")
        
        # Initialize the latest google-genai Client
        self.genai_client = genai.Client(api_key=api_key)
        
        # In 2026, 'gemini-embedding-2' is the flagship multimodal/text embedding model.
        # 'text-embedding-004' remains available for high-performance text-only RAG.
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

    def upsert_events(self, events: List[Any]):
        """Index events into the vector database."""
        if not events:
            return

        ids = []
        embeddings = []
        metadatas = []
        documents = []

        for event in events:
            # Create a rich text representation for embedding
            text_content = f"{event.title}: {event.description} Category: {event.category} Venue: {event.venue}"
            
            ids.append(str(event.id))
            embeddings.append(self._get_embedding(text_content))
            metadatas.append({
                "title": event.title,
                "category": event.category,
                "venue": event.venue,
                "datetime": event.datetime.isoformat()
            })
            documents.append(text_content)

        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=documents
        )
        logger.info(f"Indexed {len(events)} events into ChromaDB.")

    def search_events(self, query: str, n_results: int = 3) -> List[Dict[str, Any]]:
        """Find the most relevant events for a query."""
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
            logger.error(f"Search error: {e}")
            return []

# Create a singleton instance
vector_service = VectorService()
