import os
import chromadb
from google import genai
from typing import List, Dict, Any
import logging

logger = logging.getLogger("backend.vector_service")

class VectorService:
    def __init__(self):
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.collection = self.client.get_or_create_collection(name="campus_events")
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not found")
        self.genai_client = genai.Client(api_key=api_key)

    def _get_embedding(self, text: str) -> List[float]:
        response = self.genai_client.models.embed_content(
            model="text-embedding-004",
            contents=text
        )
        return response.embeddings[0].values

    def upsert_events(self, events: List[Any]):
        """Index events into the vector database."""
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

vector_service = VectorService()
