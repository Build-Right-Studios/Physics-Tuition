from app.processing.ocr import OCRHandler
from app.processing.vision import VisionHandler
from app.processing.normalizer import Normalizer
from app.processing.embedder import Embedder
from app.matching.matcher import DuplicateMatcher
from app.database.operations import DatabaseOperations
from app.database.updater import DatabaseUpdater
from app.services.openai_client import OpenAIClient
from app.utils.validators import get_collection_name, validate_source, validate_subject
from typing import List, Dict, Optional
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
        self.openai = OpenAIClient()

    async def process_questions(
        self,
        text_image_bytes: bytes,
        diagram_image_bytes: bytes = None,
        source: str = "",
        subject: str = "",
        metadata_update: dict = None,
        options_image_bytes: Optional[bytes] = None
    ) -> Dict:
        """for processing image and converting it into structural data"""
        validate_source(source)
        validate_subject(subject, source)
        logger.info(f"processing question: {source}/{subject}")

        ocr_result = await self.ocr.process(text_image_bytes)
        
        vision_bytes = diagram_image_bytes if diagram_image_bytes else text_image_bytes
        vision_result = await self.vision.analyze(vision_bytes)

        options_result = None
        if options_image_bytes:
            logger.info("Extracting options from image...")
            try:
                options_result = await self.openai.extract_options(options_image_bytes)
            except Exception as e:
                logger.error(f"Options extraction failed: {e}")
                options_result = {
                    "option_a": "",
                    "option_b": "",
                    "option_c": "",
                    "option_d": "",
                    "has_options": False
                }
        # debug: log the actual extracted options so we can see what will be returned
        logger.info("options_result=%r", options_result)

        # normalize extractor output to the expected dict shape {option_a..d, has_options}
        if options_result:
            # if extractor returned a raw string (e.g. LaTeX with options), try to parse it
            if isinstance(options_result, str):
                import re
                # look for lines starting with A) or A. etc.
                lines = re.findall(r'(?m)^[A-D][\)\.\-]\s*(.+)$', options_result)
                if not lines:
                    # try splitting by newlines and common separators
                    parts = [l.strip() for l in re.split(r'\n|\\n', options_result) if l.strip()]
                    # remove any leading labels like 'A.'
                    cleaned = [re.sub(r'^[A-D][:)\.\-]?\s*', '', p) for p in parts]
                    lines = cleaned
                option_a = lines[0] if len(lines) > 0 else options_result
                option_b = lines[1] if len(lines) > 1 else ""
                option_c = lines[2] if len(lines) > 2 else ""
                option_d = lines[3] if len(lines) > 3 else ""
                options_result = {
                    "option_a": option_a.strip(),
                    "option_b": option_b.strip(),
                    "option_c": option_c.strip(),
                    "option_d": option_d.strip(),
                    "has_options": True
                }
            elif isinstance(options_result, dict):
                # ensure keys exist and are strings
                options_result = {
                    "option_a": str(options_result.get("option_a", "")),
                    "option_b": str(options_result.get("option_b", "")),
                    "option_c": str(options_result.get("option_c", "")),
                    "option_d": str(options_result.get("option_d", "")),
                    "has_options": bool(options_result.get("has_options", True))
                }

        logger.info("normalized_options_result=%r", options_result)
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
            "options": options_result,
            "metadata": {
                "source": source,
                "subject": subject,
                "has_diagram": bool(diagram_image_bytes) or vision_result["has_diagram"],
                "math_entities": normalized.get("math_entities", [])
            }
        }
        
        if metadata_update:
            filtered_metadata_update = {k: v for k, v in metadata_update.items() if v is not None}
            processed["metadata"].update(filtered_metadata_update)

        logger.info("question processed")
        return processed
    
    async def find_matches(
        self,
        text_image_bytes: bytes,
        diagram_image_bytes: bytes = None,
        source: str = "",
        subject: str = "",
        year: int = None,
        top_k: int = 10,
        metadata_update: dict = None,
        options_image_bytes: Optional[bytes] = None
    ) -> Dict:
        processed = await self.process_questions(text_image_bytes, diagram_image_bytes, source, subject, metadata_update, options_image_bytes)
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