from typing import List, Dict, Any
from .base_vector_service import BaseVectorService

class HealthVectorService(BaseVectorService):
    def __init__(self):
        super().__init__(collection_name="health_knowledge", logger_name="backend.health_vector_service")
        
    def search_documents(self, query: str, n_results: int = 3) -> List[Dict[str, Any]]:
        return self.search(query=query, n_results=n_results)

# Create a singleton instance
health_vector_service = HealthVectorService()
