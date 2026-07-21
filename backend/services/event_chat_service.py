import os
import asyncio
import logging
from typing import Optional, List, Any

from google import genai
from google.genai import types

logger = logging.getLogger("backend.ai_service")


def _get_api_key() -> Optional[str]:
    return os.getenv("GEMINI_API_KEY")


def _get_model_name() -> str:
    return os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


from .gemini_client import get_gemini_client

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

    print(f"Sending request to Gemini ({len(contents)} messages)...")

    response = client.models.generate_content(
        model=_get_model_name(),
        contents=contents,
        config=config,
    )

    print("Received response from Gemini")

    return response.text or ""


async def generate_ai_response(
    message: str,
    history: Optional[List[dict]] = None,
    system_prompt: Optional[str] = None,
) -> str:
    return await asyncio.to_thread(
        _call_gemini,
        message,
        history,
        system_prompt,
    )