from ..services.base_vector_service import BaseVectorService
from .base_agent_service import BaseAgentService

from .prompts import (
    EVENT_AGENT_PROMPT,
    HEALTH_AGENT_PROMPT,
    PLACEMENT_AGENT_PROMPT,
    SUPPORT_AGENT_PROMPT,
)

# Vector Services
event_vector_service = BaseVectorService(collection_name="campus_events", logger_name="backend.event_vector_service")
health_vector_service = BaseVectorService(collection_name="health_knowledge", logger_name="backend.health_vector_service")
placement_vector_service = BaseVectorService(collection_name="placement_knowledge", logger_name="backend.placement_vector_service")
support_vector_service = BaseVectorService(collection_name="support_knowledge", logger_name="backend.support_vector_service")

# Context formatters
def format_event_context(docs):
    if docs:
        return "Relevant Events Found:\n" + "\n".join(
            [f"- {e['content']} (Date: {e.get('metadata', {}).get('datetime', 'N/A')})" for e in docs]
        )
    return "No specific events match the query perfectly, but you can still help based on general knowledge or state that no suitable event exists."

def format_health_context(docs):
    if docs:
        return "Relevant Health & Wellness Information:\n" + "\n".join(
            [f"- [{doc.get('metadata', {}).get('category', 'General')} / {doc.get('metadata', {}).get('title', '')}]: {doc['content']}" for doc in docs]
        )
    return "No specific wellness documents match the query perfectly. Rely on general wellness guidelines, and advise consulting professional medical care if needed."

def format_placement_context(docs):
    if docs:
        return "Relevant Placement Information:\n" + "\n".join(
            [f"- [{doc.get('metadata', {}).get('category', 'General')} / {doc.get('metadata', {}).get('title', '')}]: {doc['content']}" for doc in docs]
        )
    return "No specific placement policies or details match the query. Rely on general university placement cell redirection."

def format_support_context(docs):
    if docs:
        return "Relevant Support Information:\n" + "\n".join(
            [f"- [{doc.get('metadata', {}).get('category', 'General')} / {doc.get('metadata', {}).get('title', '')}]: {doc['content']}" for doc in docs]
        )
    return "No specific support policies match the query. Rely on general university help desk redirection."

# Agent Services
event_agent = BaseAgentService(event_vector_service, EVENT_AGENT_PROMPT, format_event_context, "event_context")
health_agent = BaseAgentService(health_vector_service, HEALTH_AGENT_PROMPT, format_health_context, "health_context")
placement_agent = BaseAgentService(placement_vector_service, PLACEMENT_AGENT_PROMPT, format_placement_context, "placement_context")
support_agent = BaseAgentService(support_vector_service, SUPPORT_AGENT_PROMPT, format_support_context, "support_context")

AGENTS = {
    "event": event_agent,
    "health": health_agent,
    "placement": placement_agent,
    "support": support_agent,
}
