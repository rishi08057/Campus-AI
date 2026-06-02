from __future__ import annotations

import os

DEFAULT_CORS_ORIGINS = ("http://localhost:3000",)


def get_cors_origins() -> list[str]:
    raw_origins = os.getenv("CAMPUSAI_CORS_ORIGINS", "")
    if not raw_origins.strip():
        return list(DEFAULT_CORS_ORIGINS)

    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]