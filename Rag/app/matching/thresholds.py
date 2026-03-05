from app.core.config import settings

def get_threshold(subject: str) -> float:
    return settings.THRESHOLDS.get(subject.lower(), 0.85)
