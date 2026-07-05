from ...services.event_chat_service import generate_ai_response
from ...services.rag_service import vector_service
from .prompt import EVENT_AGENT_PROMPT

class EventAgentService:
    @staticmethod
    async def get_response(message: str, history: list[dict]) -> str:
        """
        Generates a response using the Event Agent logic.
        Includes semantic search for relevant events and prompt construction.
        """
        # 1. Semantic Search for Context (RAG)
        relevant_events = vector_service.search_events(message, n_results=3)
        
        event_context = ""
        if relevant_events:
            event_context = "Relevant Events Found:\n" + "\n".join(
                [f"- {e['content']} (Date: {e['metadata']['datetime']})" for e in relevant_events]
            )
        else:
            event_context = "No specific events match the query perfectly, but you can still help based on general knowledge or state that no suitable event exists."

        # 2. Construct System Prompt
        system_prompt = EVENT_AGENT_PROMPT.format(event_context=event_context)

        # 3. Call AI Service
        ai_reply = await generate_ai_response(
            message=message,
            history=history,
            system_prompt=system_prompt,
        )

        return ai_reply
