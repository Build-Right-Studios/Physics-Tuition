"""
Interactive test script for the RAG pipeline.

Features:
- Prompts user for image path
- Tests full pipeline: process → match → add → verify → delete
- Clear, structured logging
- Explicit validation errors
"""

import asyncio
import sys
import os
from pathlib import Path
import logging

# Ensure project root is in path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from app.core.pipeline import RAGPipeline
from app.utils.validators import ValidationError
pipeline = RAGPipeline()
# ------------------------------------------------------------------
# Logging setup
# ------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)
logger = logging.getLogger("pipeline-test")


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------
def prompt_image_path() -> Path:
    print("\nEnter full or relative path to a question image:")
    path = Path(input("> ").strip())
    print(path)

    if not path.exists():
        raise FileNotFoundError(f"Image not found: {path}")

    if not path.is_file():
        raise ValueError(f"Not a file: {path}")

    return path


def load_image_bytes(path: Path) -> bytes:
    with open(path, "rb") as f:
        return f.read()


def print_section(title: str):
    print("\n" + "=" * 70)
    print(title)
    print("=" * 70)


# ------------------------------------------------------------------
# Tests
# ------------------------------------------------------------------
async def test_process_question(pipeline, image_bytes):
    print_section("TEST 1: PROCESS QUESTION")

    result = await pipeline.process_questions(
        image_bytes=image_bytes,
        source="neet",
        subject="physics"
    )

    assert "text" in result
    assert "latex" in result
    assert "embedding" in result
    assert "metadata" in result

    print("Process question successful")
    print(f"Text length          : {len(result['text'])}")
    print(f"LaTeX length         : {len(result['latex'])}")
    print(f"Embedding dimensions : {len(result['embedding'])}")
    print(f"Has diagram          : {result['metadata'].get('has_diagram')}")

    return result


async def test_find_matches(pipeline, image_bytes):
    print_section("TEST 2: FIND MATCHES")

    result = await pipeline.find_matches(
        image_bytes=image_bytes,
        source="neet",
        subject="physics",
        year=None,
        top_k=5
    )

    matches = result.get("matches", [])
    print(f"Matches found: {len(matches)}")

    for i, m in enumerate(matches, start=1):
        print(f"\nMatch {i}")
        print(f"  ID         : {m['question_id']}")
        print(f"  Similarity : {m['similarity_score']:.4f}")
        print(f"  Confidence : {m['confidence']}")
        print(f"  Reason     : {m['match_reason']}")

    return result


async def test_add_and_verify(pipeline, image_bytes):
    print_section("TEST 3: ADD, VERIFY, DELETE QUESTION")

    processed = await pipeline.process_questions(
        image_bytes=image_bytes,
        source="neet",
        subject="physics"
    )

    add_result = await pipeline.add_question(
        source="neet",
        subject="physics",
        question_data=processed,
        remove_duplicate_ids=[]
    )

    question_id = add_result["question_id"]
    print(f"Question added with ID: {question_id}")

    verify = await pipeline.find_matches(
        image_bytes=image_bytes,
        source="neet",
        subject="physics",
        top_k=1
    )

    if not verify["matches"]:
        raise RuntimeError("Verification failed: no matches returned")

    top_match = verify["matches"][0]
    if top_match["question_id"] != question_id:
        raise RuntimeError(
            f"Verification failed: expected {question_id}, got {top_match['question_id']}"
        )

    print("Verification successful")

    deleted = await pipeline.delete_question(
        question_id=question_id,
        source="neet",
        subject="physics"
    )

    if not deleted:
        raise RuntimeError("Cleanup failed: question not deleted")

    print("Cleanup successful")


async def test_validation_errors(pipeline, image_bytes):
    print_section("TEST 4: VALIDATION ERRORS")

    try:
        await pipeline.process_questions(
            image_bytes=image_bytes,
            source="invalid_source",
            subject="physics"
        )
        raise AssertionError("Invalid source did not raise ValidationError")
    except ValidationError:
        print("Invalid source correctly rejected")

    try:
        await pipeline.process_questions(
            image_bytes=image_bytes,
            source="jee_mains",
            subject="biology"
        )
        raise AssertionError("Invalid subject did not raise ValidationError")
    except ValidationError:
        print("Invalid subject correctly rejected")

    print("Validation tests passed")


# ------------------------------------------------------------------
# Runner
# ------------------------------------------------------------------
async def run():
    print_section("RAG PIPELINE INTERACTIVE TEST SUITE")

    image_path = prompt_image_path()
    image_bytes = load_image_bytes(image_path)

    print(f"Loaded image: {image_path}")
    print(f"Image size : {len(image_bytes)} bytes")

    pipeline = RAGPipeline()

    await test_process_question(pipeline, image_bytes)
    await test_find_matches(pipeline, image_bytes)
    await test_add_and_verify(pipeline, image_bytes)
    await test_validation_errors(pipeline, image_bytes)

    print_section("ALL TESTS COMPLETED SUCCESSFULLY")


if __name__ == "__main__":
    try:
        asyncio.run(run())
    except Exception as e:
        print("\nTEST SUITE FAILED")
        print(f"Error type : {type(e).__name__}")
        print(f"Message    : {e}")
        sys.exit(1)