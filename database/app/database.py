import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# --- Postgres config from environment ---
POSTGRES_USER = os.getenv("POSTGRES_USER", "apiuser")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "changeme")
POSTGRES_DB = os.getenv("POSTGRES_DB", "newschecks")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "db")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")

# --- SQLAlchemy Database URL ---
DATABASE_URL = (
    f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@"
    f"{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

# --- Create engine with pool settings ---
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    echo=False  # set True for SQL debugging
)

# --- Session maker ---
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# --- Declarative base for models ---
Base = declarative_base()

# Optional helper: context manager for sessions
from contextlib import contextmanager

@contextmanager
def get_session():
    """Yield a SQLAlchemy session and close automatically."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
