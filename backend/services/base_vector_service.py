import os
import time
import chromadb
import logging
from typing import List, Dict, Any
from google import genai
from google.genai import types

class BaseVectorService:
    def __init__(self, collection_name: str, logger_name: str):
        self.logger = logging.getLogger(logger_name)
        
        # Fix L9: Deterministic path or env var
        db_path = os.getenv("CHROMA_DB_PATH", os.path.join(os.path.dirname(__file__), "chroma_db"))
        self.client = chromadb.PersistentClient(path=db_path)
        self.collection = self.client.get_or_create_collection(name=collection_name)
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not found")
        
        self.genai_client = genai.Client(api_key=api_key)
        self.model_name = "gemini-embedding-2"

    def _get_embedding(self, text: str) -> List[float]:
        max_retries = 3
        retry_delay = 2
        for attempt in range(max_retries):
            try:
                response = self.genai_client.models.embed_content(
                    model=self.model_name,
                    contents=text,
                    config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY")
                )
                return response.embeddings[0].values
            except Exception as e:
                error_str = str(e).lower()
                if "429" in error_str or "resource_exhausted" in error_str or "quota exceeded" in error_str:
                    if attempt < max_retries - 1:
                        self.logger.warning(f"Rate limited (429) on embedding. Retrying in {retry_delay}s... (Attempt {attempt + 1}/{max_retries})")
                        time.sleep(retry_delay)
                        retry_delay *= 2
                        continue
                
                if "404" in error_str or "not found" in error_str:
                    self.logger.warning(f"Model {self.model_name} not found. Falling back to stable text-embedding-004.")
                    try:
                        response = self.genai_client.models.embed_content(
                            model="text-embedding-004",
                            contents=text,
                            config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY")
                        )
                        return response.embeddings[0].values
                    except Exception:
                        self.logger.warning(f"text-embedding-004 also failed. Falling back to gemini-embedding-001.")
                        response = self.genai_client.models.embed_content(
                            model="gemini-embedding-001",
                            contents=text
                        )
                        return response.embeddings[0].values
                
                self.logger.error(f"Embedding error: {e}")
                raise e

    def upsert_events(self, events: List[Any]):
        if not events:
            return

        ids = []
        embeddings = []
        metadatas = []
        documents = []

        for event in events:
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
        self.logger.info(f"Indexed {len(events)} events into ChromaDB.")

    def index_documents(self, documents: List[Dict[str, Any]]):
        if not documents:
            return

        ids = []
        embeddings = []
        metadatas = []
        docs = []

        for doc in documents:
            content = doc.get("content", "")
            category = doc.get("category", "")
            title = doc.get("title", "")
            
            text_content = f"Category: {category}\nTitle: {title}\nContent: {content}"
            
            ids.append(str(doc.get("id")))
            embeddings.append(self._get_embedding(text_content))
            
            meta = {
                "category": category,
                "title": title
            }
            if "metadata" in doc and isinstance(doc["metadata"], dict):
                for k, v in doc["metadata"].items():
                    if isinstance(v, (str, int, float, bool)):
                        meta[k] = v
                    else:
                        meta[k] = str(v)
            
            metadatas.append(meta)
            docs.append(text_content)

        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=docs
        )
        self.logger.info(f"Indexed {len(documents)} documents into ChromaDB.")

    def search(self, query: str, n_results: int = 3) -> List[Dict[str, Any]]:
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
            self.logger.error(f"Search error: {e}")
            return []
