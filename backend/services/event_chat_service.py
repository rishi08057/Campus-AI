import os
from typing import Optional, List

from google.genai import types

from ..logging_config import get_logger
from .gemini_client import get_gemini_client

logger = get_logger("gemini")


def _get_model_name() -> str:
    return os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


def _call_gemini(
    message: str,
    history: Optional[List[dict]] = None,
    system_prompt: Optional[str] = None,
) -> str:
    client = get_gemini_client()

    # Convert history to Gemini format (role mapping)
    contents = []
    if history:
        for entry in history:
            role = "user" if entry["role"] == "user" else "model"
            contents.append(types.Content(role=role, parts=[types.Part(text=entry["content"])]))

    # Add the current message
    contents.append(types.Content(role="user", parts=[types.Part(text=message)]))

    config = None
    if system_prompt:
        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
        )

    logger.info("Gemini request sent (%d messages)", len(contents))

    response = client.models.generate_content(
        model=_get_model_name(),
        contents=contents,
        config=config,
    )

    logger.info("Gemini responded")

    return response.text or ""


def generate_ai_response(
    message: str,
    history: Optional[List[dict]] = None,
    system_prompt: Optional[str] = None,
) -> str:
    return _call_gemini(
        message,
        history,
        system_prompt,
    )