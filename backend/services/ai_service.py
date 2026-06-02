import os
import logging
import asyncio
from typing import Optional

try:
    import openai
except Exception:  # pragma: no cover - defensive import
    openai = None

logger = logging.getLogger("backend.ai_service")


def _get_env_api_key() -> Optional[str]:
    # Primary: explicit OpenAI key. Secondary: generic AI key.
    return os.getenv("OPENAI_API_KEY") or os.getenv("AI_API_KEY")


def _get_model_name() -> str:
    return os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")


def _ensure_openai_available():
    if openai is None:
        raise RuntimeError("openai package is not installed")


def _configure_openai(api_key: str):
    _ensure_openai_available()
    openai.api_key = api_key


def _call_openai(message: str, system_prompt: Optional[str] = None) -> str:
    api_key = _get_env_api_key()
    if not api_key:
        raise RuntimeError("AI API key not found in environment variables")

    _configure_openai(api_key)

    model = _get_model_name()

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": message})

    try:
        # This uses the Chat Completions API which is widely supported.
        resp = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            max_tokens=512,
            temperature=0.7,
            n=1,
        )
        # Extract text safely
        content = resp.choices[0].message.get("content") if resp.choices else None
        return content or ""
    except Exception as exc:
        logger.exception("OpenAI API call failed")
        raise


async def generate_ai_response(message: str, system_prompt: Optional[str] = None) -> str:
    """
    Generate a response from the configured AI provider.

    Uses environment variables:
    - OPENAI_API_KEY or AI_API_KEY: API key for OpenAI
    - OPENAI_MODEL: optional model name (defaults to gpt-3.5-turbo)

    Returns the assistant reply as a string. Raises RuntimeError on configuration
    problems or re-raises provider exceptions.
    """
    # Run blocking provider client in a thread to avoid blocking the event loop.
    return await asyncio.to_thread(_call_openai, message, system_prompt)
