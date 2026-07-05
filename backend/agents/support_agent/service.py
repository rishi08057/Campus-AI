from ...services.event_chat_service import generate_ai_response
from ...services.support_vector_service import support_vector_service
from .prompt import SUPPORT_AGENT_PROMPT

class SupportAgentService:
    @staticmethod
    async def get_response(message: str, history: list[dict]) -> str:
        """
        Generates a response using the Support Agent logic.
        Includes semantic search for relevant support documents and prompt construction.
        """
        # 1. Semantic Search for Context (RAG)
        relevant_docs = support_vector_service.search_documents(message, n_results=3)
        
        support_context = ""
        if relevant_docs:
            support_context = "Relevant Support Information:\n" + "\n".join(
                [f"- [{doc['metadata'].get('category', 'General')} / {doc['metadata'].get('title', '')}]: {doc['content']}" for doc in relevant_docs]
            )
        else:
            support_context = "No specific support policies match the query. Rely on general university help desk redirection."

        # 2. Construct System Prompt
        system_prompt = SUPPORT_AGENT_PROMPT.format(support_context=support_context)

        # 3. Call AI Service
        ai_reply = await generate_ai_response(
            message=message,
            history=history,
            system_prompt=system_prompt,
        )

        return ai_reply

