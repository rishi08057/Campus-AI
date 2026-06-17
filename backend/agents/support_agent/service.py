from ...services.ai_service import generate_ai_response
from .prompt import SUPPORT_AGENT_PROMPT

class SupportAgentService:
    @staticmethod
    async def get_response(message: str, history: list[dict]) -> str:
        """
        Generates a response using the Support Agent logic.
        """
        # Call AI Service with support prompt
        ai_reply = await generate_ai_response(
            message=message,
            history=history,
            system_prompt=SUPPORT_AGENT_PROMPT,
        )

        return ai_reply
