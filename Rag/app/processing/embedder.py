from app.services.openai_client import OpenAIClient

class Embedder:

    def __init__(self):
        self.client = OpenAIClient()

    async def generate(self, text: str) -> list[float]:
        return await self.client.create_embedding(text)