from fastapi import HTTPException
from .config import AGENTS

class AgentRouter:
    """
    Central router that dispatches chat requests to the appropriate agent service.
    """

    @staticmethod
    def route(agent_type: str, message: str, history: list[dict]) -> str:
        """
        Routes the message and history to the agent specified by agent_type.
        """
        agent = AGENTS.get(agent_type)
        if not agent:
            raise HTTPException(status_code=400, detail=f"Invalid agent_type: {agent_type}")
        
        return agent.get_response(message, history)
