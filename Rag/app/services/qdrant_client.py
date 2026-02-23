from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct,
    Filter, FieldCondition, MatchValue, PointIdsList
)
from app.core.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class QdrantService:

    def __init__(self):
        self.client = QdrantClient(
            host=settings.QDRANT_URL,
            port=443,
            https=True,
            api_key=settings.QDRANT_API_KEY,
            prefer_grpc=False,
        )

    def create_collection(self, collection_name: str) -> bool:
        existing = {c.name for c in self.client.get_collections().collections}
        if collection_name in existing:
            return False

        self.client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
        logger.info(f"Created collection: {collection_name}")
        return True

    def upsert(self, collection_name: str, point_id: str, vector: list[float], payload: dict):
        self.client.upsert(
            collection_name=collection_name,
            points=[PointStruct(id=point_id, vector=vector, payload=payload)],
        )

    def search(
        self,
        collection_name: str,
        query_vector: list[float],
        top_k: int = 10,
        year: Optional[int] = None,
        extra_filters: Optional[list] = None,
    ) -> list[dict]:
        conditions = []

        if year is not None:
            conditions.append(FieldCondition(key="year", match=MatchValue(value=year)))

        if extra_filters:
            conditions.extend(extra_filters)

        response = self.client.query_points(
            collection_name=collection_name,
            query=query_vector,
            query_filter=Filter(must=conditions) if conditions else None,
            limit=top_k,
            with_payload=True,
        )

        return [{"id": hit.id, "score": hit.score, "payload": hit.payload} for hit in response.points]

    def delete(self, collection_name: str, point_id: str):
        self.client.delete(
            collection_name=collection_name,
            points_selector=PointIdsList(points=[point_id]),
        )
