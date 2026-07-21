from ..services.event_chat_service import generate_ai_response

class BaseAgentService:
    def __init__(self, vector_service, prompt_template, context_formatter, context_key="context"):
        self.vector_service = vector_service
        self.prompt_template = prompt_template
        self.context_formatter = context_formatter
        self.context_key = context_key
        
    async def get_response(self, message: str, history: list[dict]) -> str:
        relevant_docs = self.vector_service.search(message, n_results=3)
        context = self.context_formatter(relevant_docs)
        kwargs = {self.context_key: context}
        system_prompt = self.prompt_template.format(**kwargs)
        
        return await generate_ai_response(
            message=message,
            history=history,
            system_prompt=system_prompt,
        )
