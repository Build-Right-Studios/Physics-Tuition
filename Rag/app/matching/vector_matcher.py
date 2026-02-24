from app.services.qdrant_client import QdrantService
from app.utils.validators import get_collection_name
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class VectorMatcher:
    def __init__(self):
        self.qdrant = QdrantService()

    async def search(self, embedding: List[float], source: str, subject: str, year: Optional[int] = None, top_k: int = 50) -> List[Dict]:
        """handles searching in qdrant for relevant matches and returns the list of matches"""

        collection_name = get_collection_name(source, subject)
        logger.info(f"Vector search: subject={subject}, top_k={top_k}")
        
        
        results = self.qdrant.search(
            collection_name=collection_name,
            query_vector=embedding,
            top_k=top_k,
            year=year,
        )
        
        logger.info(f"Found {len(results)} candidates")
        return results