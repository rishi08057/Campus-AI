from typing import List, Dict, Any
from .base_vector_service import BaseVectorService

class VectorService(BaseVectorService):
    def __init__(self):
        super().__init__(collection_name="campus_events", logger_name="backend.vector_service")
        
    def search_events(self, query: str, n_results: int = 3) -> List[Dict[str, Any]]:
        return self.search(query=query, n_results=n_results)

# Create a singleton instance
vector_service = VectorService()
