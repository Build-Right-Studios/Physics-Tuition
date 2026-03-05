from app.services.qdrant_client import QdrantService
from app.utils.validators import get_collection_name
from typing import Dict, Optional, List
import logging

logger = logging.getLogger(__name__)

class DatabaseOperations:
    """Read operations on Qdrant"""
    
    def __init__(self):
        self.qdrant = QdrantService()
    
    async def get_question(
        self, 
        question_id: str, 
        source: str,
        subject: str
    ) -> Optional[Dict]:
        """
        to get a single question by its id
        """
        collection_name = get_collection_name(source, subject)
        
        logger.info(f"Fetching question {question_id} from {collection_name}")
        
        try:
            result = self.qdrant.client.retrieve(
                collection_name=collection_name,
                ids=[question_id]
            )
            
            if result:
                logger.info(f"Found question {question_id}")
                return result[0].payload
            
            logger.warning(f"Question {question_id} not found in {collection_name}")
            return None
            
        except Exception as e:
            logger.error(f"Get question error: {e}")
            return None
    
    async def get_questions_by_year(
        self,
        source: str,
        subject: str,
        year: int
    ) -> List[Dict]:
        """
        to fetch all questions from a specific year
        """
        collection_name = get_collection_name(source, subject)
        
        logger.info(f"Fetching questions from {collection_name} for year {year}")
        
        try:
            from qdrant_client import models
            
            results = self.qdrant.client.scroll(
                collection_name=collection_name,
                scroll_filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="year",
                            match=models.MatchValue(value=year)
                        )
                    ]
                ),
                limit=100
            )
            
            questions = [point.payload for point in results[0]]
            logger.info(f"Found {len(questions)} questions from year {year}")
            
            return questions
            
        except Exception as e:
            logger.error(f"Get questions by year error: {e}")
            return []
    
    async def get_collection_stats(
        self,
        source: str,
        subject: str
    ) -> Dict:
        """
        getting stats about a collection like total questions, vector size, etc.
        """
        collection_name = get_collection_name(source, subject)
        
        logger.info(f"Getting stats for {collection_name}")
        
        try:
            collection_info = self.qdrant.client.get_collection(
                collection_name=collection_name
            )
            
            stats = {
                "collection_name": collection_name,
                "source": source,
                "subject": subject,
                "total_questions": collection_info.points_count,
                "vector_size": collection_info.config.params.vectors.size,
                "distance_metric": collection_info.config.params.vectors.distance.name
            }
            
            logger.info(f"Collection {collection_name} has {stats['total_questions']} questions")
            
            return stats
            
        except Exception as e:
            logger.error(f"Get collection stats error: {e}")
            return {
                "collection_name": collection_name,
                "error": str(e)
            }
    
    async def check_question_exists(
        self,
        question_id: str,
        source: str,
        subject: str
    ) -> bool:
        """
        to check if a question exists by its id
        """
        question = await self.get_question(question_id, source, subject)
        return question is not None