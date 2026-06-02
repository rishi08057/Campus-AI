import os
import asyncio
import logging
from typing import Optional

from google import genai

logger = logging.getLogger("backend.ai_service")


def _get_api_key() -> Optional[str]:
    return os.getenv("GEMINI_API_KEY")


def _get_model_name() -> str:
    return os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def _call_gemini(message: str, system_prompt: Optional[str] = None) -> str:
    api_key = _get_api_key()

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not found")

    client = genai.Client(api_key=api_key)

    prompt = message

    if system_prompt:
        prompt = f"{system_prompt}\n\nUser: {message}"

    print("Sending request to Gemini...")

    response = client.models.generate_content(
        model=_get_model_name(),
        contents=prompt,
    )

    print("Received response from Gemini")

    return response.text or ""


async def generate_ai_response(
    message: str,
    system_prompt: Optional[str] = None,
) -> str:
    return await asyncio.to_thread(
        _call_gemini,
        message,
        system_prompt,
    )