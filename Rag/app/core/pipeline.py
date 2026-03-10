from app.processing.ocr import OCRHandler
from app.processing.vision import VisionHandler
from app.processing.normalizer import Normalizer
from app.processing.embedder import Embedder
from app.matching.matcher import DuplicateMatcher
from app.database.operations import DatabaseOperations
from app.database.updater import DatabaseUpdater
from app.utils.validators import get_collection_name, validate_source, validate_subject
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class RAGPipeline:
    def __init__(self):
        self.ocr = OCRHandler()
        self.vision = VisionHandler()
        self.normalizer = Normalizer()
        self.embedder = Embedder()
        self.matcher = DuplicateMatcher()
        self.db_ops = DatabaseOperations()
        self.db_updater = DatabaseUpdater()

    async def process_questions(
        self,
        image_bytes: bytes,
        source: str,
        subject: str
    ) -> Dict:
        """for processing image and converting it into structural data"""
        validate_source(source)
        validate_subject(subject, source)
        logger.info(f"processing question: {source}/{subject}")

        ocr_result = await self.ocr.process(image_bytes)
        vision_result = await self.vision.analyze(image_bytes)

        normalized = self.normalizer.normalize(
            latex = ocr_result["latex"],
            text = ocr_result["text"],
            diagram = vision_result.get("description", "")
        )

        embedding = await self.embedder.generate(normalized["searchable_text"])

        processed = {
            "latex": ocr_result["latex"],
            "text": ocr_result["text"],
            "normalized_text": normalized["text"],
            "embedding": embedding,
            "diagram_description": vision_result["description"],
            "circuit_topology": vision_result.get("circuit_topology"),
            "concept": normalized.get("concept"),
            "critical_terms": normalized.get("critical_terms", []),
            "metadata": {
                "source": source,
                "subject": subject,
                "has_diagram": vision_result["has_diagram"],
                "math_entities": normalized.get("math_entities", [])
            }
        }

        logger.info("question processed")
        return processed
    
    async def find_matches(
        self,
        image_bytes: bytes,
        source: str,
        subject: str,
        year: int = None,
        top_k: int = 10
    ) -> Dict:
        processed = await self.process_questions(image_bytes, source, subject)
        matches = await self.matcher.find_duplicates(
            question=processed,
            source=source,
            subject=subject,
            year=year,
            top_k=top_k
        )

        return {
            "processed_question": processed,
            "matches": matches
        }
    
    async def add_question(
        self,
        source: str,
        subject: str,
        question_data: Dict,
        remove_duplicate_ids: List[str] = []
    ) -> Dict:
        """add new question and remove duplicates"""

        removed = []
        for dup in remove_duplicate_ids:
            success = await self.db_updater.delete_question(
                question_id = dup,
                source=source,
                subject=subject
            )

            if success:
                removed.append(dup)

        question_id = await self.db_updater.add_question(
            question_data=question_data,
            source=source,
            subject=subject
        )

        return {
            "question_id": question_id,
            "removed_ids": removed
        }
    
    async def delete_question(
        self,
        question_id: str,
        source: str,
        subject: str 
    ) -> bool:
        return await self.db_updater.delete_question(
            question_id=question_id,
            source=source,
            subject=subject
        )