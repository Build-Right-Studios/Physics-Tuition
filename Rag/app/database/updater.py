import uuid
from app.services.qdrant_client import QdrantService
from app.utils.validators import get_collection_name
import logging

logger = logging.getLogger(__name__)

class DatabaseUpdater:

    def __init__(self):
        self.qdrant = QdrantService()

    def add_question(
        self,
        source: str,
        subject: str,
        vector: list[float],
        latex: str,
        text: str,
        normalized_text: str,
        year: int,
        circuit_topology: str = None,
        metadata: dict = None,
    ) -> str:
        question_id = str(uuid.uuid4())
        collection_name = get_collection_name(source, subject)

        payload = {
            "latex": latex,
            "text": text,
            "normalized_text": normalized_text,
            "year": year,
            "source": source,
            "subject": subject,
            "circuit_topology": circuit_topology,
            **(metadata or {}),
        }

        self.qdrant.upsert(collection_name, question_id, vector, payload)
        logger.info(f"Added question {question_id} to {collection_name}")

        return question_id
