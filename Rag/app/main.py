from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.pipeline import RAGPipeline
from app.api.models import (
    MatchResponse, ProcessedQuestion, Match,
    AddQuestionRequest, AddQuestionResponse,
)
from app.utils.validators import ValidationError
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(name)s | %(message)s")

logger = logging.getLogger(__name__)

app = FastAPI(title="Physics Tuition RAG API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

pipeline = RAGPipeline()


@app.post("/process", response_model=ProcessedQuestion)
async def process_question(
    image: UploadFile = File(...),
    source: str = Form(...),
    subject: str = Form(...),
):
    try:
        image_bytes = await image.read()
        return await pipeline.process_questions(image_bytes, source, subject)
    except ValidationError as e:
        raise HTTPException(422, detail=str(e))
    except Exception as e:
        logger.error(f"process error: {e}")
        raise HTTPException(500, detail=str(e))


@app.post("/match", response_model=MatchResponse)
async def find_matches(
    image: UploadFile = File(...),
    source: str = Form(...),
    subject: str = Form(...),
    year: int = Form(None),
    top_k: int = Form(10, ge=1, le=50),
):
    try:
        image_bytes = await image.read()
        result = await pipeline.find_matches(image_bytes, source, subject, year, top_k)

        matches = [
            Match(
                question_id=m["question_id"], similarity_score=m["similarity_score"],
                latex=m.get("latex", ""), text=m.get("text", ""),
                source=source, subject=subject, year=m.get("year"),
                diagram_description=m.get("diagram_description"),
                match_breakdown=m.get("match_breakdown", {}),
                match_reason=m.get("match_reason", ""), confidence=m.get("confidence", "low"),
            )
            for m in result.get("matches", [])
        ]

        return MatchResponse(
            status="success", source=source, subject=subject,
            processed_question=result["processed_question"],
            matches=matches, match_count=len(matches),
        )
    except ValidationError as e:
        raise HTTPException(422, detail=str(e))
    except Exception as e:
        logger.error(f"match error: {e}")
        raise HTTPException(500, detail=str(e))


@app.post("/question", response_model=AddQuestionResponse)
async def add_question(req: AddQuestionRequest):
    try:
        result = await pipeline.add_question(
            source=req.source, subject=req.subject,
            question_data=req.question_data,
            remove_duplicate_ids=req.remove_duplicate_ids,
        )
        removed = result.get("removed_ids", [])
        return AddQuestionResponse(
            status="success", source=req.source, subject=req.subject,
            question_id=result["question_id"], removed_ids=removed,
            message=f"added. {len(removed)} duplicates removed.",
        )
    except ValidationError as e:
        raise HTTPException(422, detail=str(e))
    except Exception as e:
        logger.error(f"add error: {e}")
        raise HTTPException(500, detail=str(e))


@app.delete("/question/{question_id}")
async def delete_question(question_id: str, source: str, subject: str):
    try:
        ok = await pipeline.delete_question(question_id, source, subject)
        if not ok:
            raise HTTPException(404, detail=f"question {question_id} not found")
        return {"status": "deleted", "question_id": question_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"delete error: {e}")
        raise HTTPException(500, detail=str(e))
