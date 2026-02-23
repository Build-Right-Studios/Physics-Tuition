from app.services.openai_client import OpenAIClient

class LLMVerifier:

    def __init__(self):
        self.client = OpenAIClient()

    async def verify(self, question: dict, candidate: dict) -> dict:
        return await self.client.verify_duplicate(question, candidate)
