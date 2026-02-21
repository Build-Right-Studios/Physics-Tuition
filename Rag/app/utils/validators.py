from app.core.config import settings
from typing import Optional

class ValidationError(Exception):
    pass

def validate_source(source: str) -> str:
    if source not in settings.VALID_SOURCES:
        raise ValidationError(f"Invalid source: {source}. Valid sources are: {settings.VALID_SOURCES}")
    return source

def validate_subject(subject: str, source: str) -> str:
    valid_subjects = settings.VALID_SUBJECTS.get(source, [])
    if subject not in valid_subjects:
        raise ValidationError(
            f"Invalid subject '{subject}' for source '{source}'. "
            f"Valid subjects: {', '.join(valid_subjects)}"
        )
    return subject

def get_collection_name(source: str, subject: str) -> str:
    return f"{source}_{subject}"

def get_threshold(subject: str) -> float:
    return settings.THRESHOLDS.get(subject, 0.85)