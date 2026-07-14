from ...services.event_chat_service import generate_ai_response
from ...services.placement_vector_service import placement_vector_service
from .prompt import PLACEMENT_AGENT_PROMPT

class PlacementAgentService:
    @staticmethod
    async def get_response(message: str, history: list[dict]) -> str:
        """
        Generates a response using the Placement Agent logic.
        Includes semantic search for relevant placement documents and prompt construction.
        """
        # 1. Semantic Search for Context (RAG)
        relevant_docs = placement_vector_service.search_documents(message, n_results=3)
        
        placement_context = ""
        if relevant_docs:
            placement_context = "Relevant Placement Information:\n" + "\n".join(
                [f"- [{doc['metadata'].get('category', 'General')} / {doc['metadata'].get('title', '')}]: {doc['content']}" for doc in relevant_docs]
            )
        else:
            placement_context = "No specific placement policies or details match the query. Rely on general university placement cell redirection."

        # 2. Construct System Prompt
        system_prompt = PLACEMENT_AGENT_PROMPT.format(placement_context=placement_context)

        # 3. Call AI Service
        ai_reply = await generate_ai_response(
            message=message,
            history=history,
            system_prompt=system_prompt,
        )

        return ai_reply
