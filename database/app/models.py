from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, func
from database import Base

class Check(Base):
    """
    ORM model for storing fake news verification queries.
    """
    __tablename__ = "checks"

    id = Column(Integer, primary_key=True, index=True)
    query_text = Column(String, nullable=False)
    verdict = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    evidence = Column(JSON, nullable=True)  # stores list of dicts
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Check(id={self.id}, verdict={self.verdict}, score={self.score})>"
