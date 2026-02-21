from app.services.qdrant_client import QdrantClient
from app.utils.validator import get_collection_name
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class VectorMatcher:
    def __init__(self):
        self.qdrant = QdrantClient()

    async def search(self, embedding: List[float], source: str, subject: str, year: Optional[int] = None, top_k: int = 50) -> List[Dict]:
        """handles searching in qdrant for relevant matches and returns the list of matches"""

        collection_name = get_collection_name(source, subject)
        logger.info(f"Vector search: subject={subject}, top_k={top_k}")
        
        
        filter_conditions = {}
        if year:
            filter_conditions["year"] = year  # NOTE THAT CURRENTLY WRITTEN FOR JEE ONLY, IF NEET , BOARDS ALL NEEDED THEN WE WOULD NEED TO DO SOME DYNAMIC FILTER COND WITH MULTIPLE FIELDS
        
        results = await self.qdrant.search(
            collection_name=collection_name,
            query_vector=embedding,
            limit=top_k,
            filter_conditions=filter_conditions if filter_conditions else None
        )
        
        logger.info(f"Found {len(results)} candidates")
        return results