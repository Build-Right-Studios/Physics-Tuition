from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
from app.utils.validators import validate_source, validate_subject

# request models

class MatchRequest(BaseModel):
    """Request to find matches"""
    source: str = Field(..., description="jee_mains, jee_advanced, neet, etc.")
    subject: str = Field(..., description="physics, chemistry, maths, biology")
    year: Optional[int] = None
    top_k: int = Field(10, description="Number of matches to return", ge=1, le=50)

    @field_validator("source")
    @classmethod
    def validate_source_field(cls, v):
        return validate_source(v)

    @field_validator("subject")
    @classmethod
    def validate_subject_field(cls, v, info):
        source = info.data.get("source")
        if source:
            return validate_subject(v, source)
        return v


class AddQuestionRequest(BaseModel):
    """Request to add question after admin review"""
    source: str
    subject: str
    question_data: Dict[str, Any] = Field(..., description="Processed question data")
    remove_duplicate_ids: List[str] = Field(default_factory=list, description="IDs to remove")

    @field_validator("source")
    @classmethod
    def validate_source_field(cls, v):
        return validate_source(v)

    @field_validator("subject")
    @classmethod
    def validate_subject_field(cls, v, info):
        source = info.data.get("source")
        if source:
            return validate_subject(v, source)
        return v


# response models

class Options(BaseModel):
    option_a: str = ""
    option_b: str = ""
    option_c: str = ""
    option_d: str = ""
    has_options: bool = False


class ProcessedQuestion(BaseModel):
    """Processed question data"""
    latex: str
    text: str
    normalized_text: str
    embedding: List[float]
    diagram_description: Optional[str] = None
    circuit_topology: Optional[str] = None
    concept: Optional[str] = None
    critical_terms: List[str] = Field(default_factory=list)
    options: Optional[Options] = None
    metadata: Dict[str, Any]


class Match(BaseModel):
    """Single match result"""
    question_id: str
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    latex: str
    text: str
    source: str
    subject: str
    year: Optional[int]
    diagram_description: Optional[str]
    match_breakdown: Dict[str, float] = Field(
        ...,
        description="vector_score, latex_score, circuit_score, etc."
    )
    match_reason: str = Field(..., description="Why this is a match")
    confidence: str = Field(..., description="high, medium, low")


class MatchResponse(BaseModel):
    """Response with all matches"""
    status: str
    source: str
    subject: str
    processed_question: ProcessedQuestion
    matches: List[Match]
    match_count: int


class AddQuestionResponse(BaseModel):
    """Response after adding question"""
    status: str
    source: str
    subject: str
    question_id: str
    removed_ids: List[str]
    message: Optional[str] = None
    processed_question: Optional[ProcessedQuestion] = None