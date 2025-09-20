from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
import os

DATABASE_URL = "postgresql+psycopg2://postgres:sppostgresuser25@34.180.14.123:5432/postgres"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

def test_connection():
    try:
        with engine.connect() as conn:
            return True
    except OperationalError as e:
        print(f"DB not ready: {e}")
        return False
