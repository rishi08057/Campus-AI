from ...services.event_chat_service import generate_ai_response
from ...services.health_vector_service import health_vector_service
from .prompt import HEALTH_AGENT_PROMPT

class HealthAgentService:
    @staticmethod
    async def get_response(message: str, history: list[dict]) -> str:
        """
        Generates a response using the Health Agent logic.
        Includes semantic search for relevant health/wellness documents and prompt construction.
        """
        # 1. Semantic Search for Context (RAG)
        relevant_docs = health_vector_service.search_documents(message, n_results=3)
        
        health_context = ""
        if relevant_docs:
            health_context = "Relevant Health & Wellness Information:\n" + "\n".join(
                [f"- [{doc['metadata'].get('category', 'General')} / {doc['metadata'].get('title', '')}]: {doc['content']}" for doc in relevant_docs]
            )
        else:
            health_context = "No specific wellness documents match the query perfectly. Rely on general wellness guidelines, and advise consulting professional medical care if needed."

        # 2. Construct System Prompt
        system_prompt = HEALTH_AGENT_PROMPT.format(health_context=health_context)

        # 3. Call AI Service
        ai_reply = await generate_ai_response(
            message=message,
            history=history,
            system_prompt=system_prompt,
        )

        return ai_reply
