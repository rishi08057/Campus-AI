from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

# Default to SQLite for development.
# Can be overridden by DATABASE_URL in .env
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/campusai"
)

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    # If sqlite URL is relative, anchor it to the directory containing this file
    if SQLALCHEMY_DATABASE_URL.startswith("sqlite:///") and not SQLALCHEMY_DATABASE_URL.startswith("sqlite:////") and not (len(SQLALCHEMY_DATABASE_URL) > 11 and SQLALCHEMY_DATABASE_URL[11] == ':'):
        db_file = SQLALCHEMY_DATABASE_URL.replace("sqlite:///", "")
        if db_file.startswith("./"):
            db_file = db_file[2:]
        absolute_path = os.path.join(os.path.dirname(__file__), db_file)
        # SQLAlchemy sqlite URI for absolute path on Windows needs to look like sqlite:///C:/path
        # On Linux sqlite:////absolute/path
        if os.name == 'nt':
            SQLALCHEMY_DATABASE_URL = f"sqlite:///{absolute_path}"
        else:
            SQLALCHEMY_DATABASE_URL = f"sqlite:////{absolute_path}"

    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()