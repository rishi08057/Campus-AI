"""Centralized logging configuration for CampusAI backend."""

import logging
import sys

APP_LOGGER_NAME = "campusai"

# Third-party loggers to suppress (set to WARNING or ERROR)
_NOISY_LOGGERS = {
    "watchfiles": logging.WARNING,
    "watchfiles.main": logging.WARNING,
    "uvicorn": logging.WARNING,
    "uvicorn.access": logging.WARNING,
    "uvicorn.error": logging.WARNING,
    "google_genai": logging.WARNING,
    "httpx": logging.WARNING,
    "httpcore": logging.WARNING,
    "urllib3": logging.WARNING,
    "chromadb": logging.ERROR,
    "chromadb.config": logging.ERROR,
    "chromadb.telemetry": logging.ERROR,
    "opentelemetry": logging.ERROR,
    "onnxruntime": logging.ERROR,
}


def setup_logging() -> logging.Logger:
    """Configure logging once for the entire backend.

    Returns the application-level logger that all modules should use.
    """
    # Configure the root logger with a clean format
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("%(message)s"))

    root = logging.getLogger()
    root.setLevel(logging.WARNING)  # Default: suppress everything
    root.addHandler(handler)

    # Application logger at INFO level
    app_logger = logging.getLogger(APP_LOGGER_NAME)
    app_logger.setLevel(logging.INFO)

    # Silence noisy third-party loggers
    for name, level in _NOISY_LOGGERS.items():
        logging.getLogger(name).setLevel(level)

    return app_logger


def get_logger(name: str | None = None) -> logging.Logger:
    """Get a child logger under the campusai namespace.

    Usage:
        from backend.logging_config import get_logger
        logger = get_logger(__name__)
    """
    if name is None:
        return logging.getLogger(APP_LOGGER_NAME)
    return logging.getLogger(f"{APP_LOGGER_NAME}.{name}")
