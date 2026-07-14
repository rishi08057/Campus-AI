from .event_agent.service import EventAgentService
from .support_agent.service import SupportAgentService
from .placement_agent.service import PlacementAgentService

class AgentRouter:
    """
    Central router that dispatches chat requests to the appropriate agent service.
    """

    @staticmethod
    async def route(agent_type: str, message: str, history: list[dict]) -> str:
        """
        Routes the message and history to the agent specified by agent_type.
        Defaults to EventAgentService if agent_type is unrecognized.
        """
        if agent_type == "support":
            return await SupportAgentService.get_response(message, history)
        elif agent_type == "placement":
            return await PlacementAgentService.get_response(message, history)
        
        # Default to Event Agent
        return await EventAgentService.get_response(message, history)
