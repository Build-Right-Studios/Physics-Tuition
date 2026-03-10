import uuid
from app.services.qdrant_client import QdrantService
from app.utils.validators import get_collection_name
import logging

logger = logging.getLogger(__name__)

class DatabaseUpdater:

    def __init__(self):
        self.qdrant = QdrantService()

    async def add_question(self, question_data: dict, source: str, subject: str) -> str:
        question_id = str(uuid.uuid4())
        collection_name = get_collection_name(source, subject)

        self.qdrant.create_collection(collection_name)

        embedding = question_data.get("embedding", [])

        payload = {
            "latex": question_data.get("latex", ""),
            "text": question_data.get("text", ""),
            "normalized_text": question_data.get("normalized_text", ""),
            "year": question_data.get("metadata", {}).get("year"),
            "source": source,
            "subject": subject,
            "circuit_topology": question_data.get("circuit_topology"),
            "diagram_description": question_data.get("diagram_description"),
            "concept": question_data.get("concept"),
            "critical_terms": question_data.get("critical_terms", []),
            "has_diagram": question_data.get("metadata", {}).get("has_diagram", False),
        }

        self.qdrant.upsert(collection_name, question_id, embedding, payload)
        logger.info(f"Added question {question_id} to {collection_name}")

        return question_id

    async def delete_question(self, question_id: str, source: str, subject: str) -> bool:
        collection_name = get_collection_name(source, subject)
        try:
            self.qdrant.delete(collection_name, question_id)
            logger.info(f"Deleted {question_id} from {collection_name}")
            return True
        except Exception as e:
            logger.error(f"Delete failed: {e}")
            return False