from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.pipeline import RAGPipeline
from app.api.models import (
    MatchResponse, ProcessedQuestion, Match,
    AddQuestionRequest, AddQuestionResponse,
)
from app.utils.validators import ValidationError
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(name)s | %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Physics Tuition RAG API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

pipeline = RAGPipeline()


@app.post("/process", response_model=ProcessedQuestion)
async def process_question(
    text_image:    UploadFile           = File(...),
    diagram_image: Optional[UploadFile] = File(None),
    options_image: Optional[UploadFile] = File(None, description="MCQ options image"),
    source:        str                  = Form(...),
    subject:       str                  = Form(...),
    special_note:  Optional[str]        = Form(None),
    class_name:    Optional[str]        = Form(None, alias="class"),
    chapter:       Optional[str]        = Form(None),
    subtopic:      Optional[str]        = Form(None),
    difficulty:    Optional[str]        = Form(None),
    exam_tags:     Optional[str]        = Form(None),
    appearances:   Optional[str]        = Form(None),
):
    try:
        text_image_bytes    = await text_image.read()
        diagram_image_bytes = await diagram_image.read() if diagram_image else None
        options_image_bytes = None
        if options_image:
            options_image_bytes = await options_image.read()
            if not options_image_bytes:
                raise HTTPException(status_code=400, detail="Options file is empty")

        metadata_update = {
            "special_note": special_note,
            "class":        class_name,
            "chapter":      chapter,
            "subtopic":     subtopic,
            "difficulty":   difficulty,
            "exam_tags":    exam_tags,
            "appearances":  appearances
        }

        result = await pipeline.process_questions(
            text_image_bytes=text_image_bytes,
            diagram_image_bytes=diagram_image_bytes,
            options_image_bytes=options_image_bytes,
            source=source,
            subject=subject,
            metadata_update=metadata_update
        )

        logger.info(f"process endpoint options: {result.get('options')}")
        return result

    except ValidationError as e:
        raise HTTPException(422, detail=str(e))
    except Exception as e:
        logger.error(f"process error: {e}")
        raise HTTPException(500, detail=str(e))


@app.post("/match", response_model=MatchResponse)
async def find_matches(
    text_image:    UploadFile           = File(...),
    diagram_image: Optional[UploadFile] = File(None),
    options_image: Optional[UploadFile] = File(None, description="MCQ options image"),
    source:        str                  = Form(...),
    subject:       str                  = Form(...),
    year:          Optional[int]        = Form(None),
    top_k:         int                  = Form(10, ge=1, le=50),
    special_note:  Optional[str]        = Form(None),
    class_name:    Optional[str]        = Form(None, alias="class"),
    chapter:       Optional[str]        = Form(None),
    subtopic:      Optional[str]        = Form(None),
    difficulty:    Optional[str]        = Form(None),
    exam_tags:     Optional[str]        = Form(None),
    appearances:   Optional[str]        = Form(None),
):
    try:
        text_image_bytes    = await text_image.read()
        diagram_image_bytes = await diagram_image.read() if diagram_image else None
        options_bytes       = None
        if options_image:
            options_bytes = await options_image.read()
            if not options_bytes:
                raise HTTPException(status_code=400, detail="Options file is empty")

        metadata_update = {
            "special_note": special_note,
            "class":        class_name,
            "chapter":      chapter,
            "subtopic":     subtopic,
            "difficulty":   difficulty,
            "exam_tags":    exam_tags,
            "appearances":  appearances
        }

        result = await pipeline.find_matches(
            text_image_bytes=text_image_bytes,
            diagram_image_bytes=diagram_image_bytes,
            source=source,
            subject=subject,
            year=year,
            top_k=top_k,
            metadata_update=metadata_update,
            options_image_bytes=options_bytes
        )

        logger.info(f"match endpoint processed_question options: {result['processed_question'].get('options')}")

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
async def add_question(
    req:                  Request,
    text_image:           Optional[UploadFile] = File(None),
    diagram_image:        Optional[UploadFile] = File(None),
    options_image:        Optional[UploadFile] = File(None),
    source:               Optional[str]        = Form(None),
    subject:              Optional[str]        = Form(None),
    remove_duplicate_ids: Optional[str]        = Form(None),
):
    content_type = req.headers.get("content-type", "")
    is_multipart = content_type.startswith("multipart/form-data") or any([text_image, diagram_image, options_image, source])

    if is_multipart:
        rids = remove_duplicate_ids or []
        if isinstance(rids, str):
            try:
                import json
                rids = json.loads(rids)
            except Exception:
                rids = [rids] if rids else []

        if not source or not subject:
            raise HTTPException(422, detail="source and subject are required")

        text_bytes    = await text_image.read()    if text_image    else None
        diagram_bytes = await diagram_image.read() if diagram_image else None
        options_bytes = await options_image.read() if options_image else None

        processed = await pipeline.process_questions(
            text_image_bytes=text_bytes,
            diagram_image_bytes=diagram_bytes,
            options_image_bytes=options_bytes,
            source=source,
            subject=subject,
            metadata_update={}
        )

        add_result = await pipeline.add_question(
            source=source,
            subject=subject,
            question_data=processed,
            remove_duplicate_ids=rids
        )

        return AddQuestionResponse(
            status="success",
            source=source,
            subject=subject,
            question_id=add_result["question_id"],
            removed_ids=add_result.get("removed_ids", []),
            message=f"added. {len(add_result.get('removed_ids', []))} duplicates removed.",
            processed_question=processed
        )
    else:
        body    = await req.json()
        payload = AddQuestionRequest(**body)
        add_result = await pipeline.add_question(
            source=payload.source,
            subject=payload.subject,
            question_data=payload.question_data,
            remove_duplicate_ids=payload.remove_duplicate_ids
        )
        return AddQuestionResponse(
            status="success",
            source=payload.source,
            subject=payload.subject,
            question_id=add_result["question_id"],
            removed_ids=add_result.get("removed_ids", []),
            message=f"added. {len(add_result.get('removed_ids', []))} duplicates removed.",
            processed_question=None
        )


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