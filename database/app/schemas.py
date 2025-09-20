from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class QueryIn(BaseModel):
    """
    Incoming request model for verifying text.
    """
    text: str = Field(..., description="The text to verify for authenticity")


class EvidenceItem(BaseModel):
    """
    Evidence from sources such as NewsAPI articles or tweets.
    """
    type: Literal["article", "tweet"] = Field(..., description="Type of evidence")
    source: Optional[str] = Field(None, description="News source name, if applicable")
    title: Optional[str] = Field(None, description="Article title, if applicable")
    url: Optional[str] = Field(None, description="URL of article, if applicable")
    text: Optional[str] = Field(None, description="Tweet text, if applicable")
    sim: float = Field(..., ge=0, le=1, description="Similarity score (0–1)")


class VerifyOut(BaseModel):
    """
    Response model returned after verification.
    """
    verdict: str = Field(..., description="Verdict: Likely True / Likely False / Unsure")
    score: float = Field(..., ge=0, le=1, description="Confidence score (0–1)")
    evidence: List[EvidenceItem]

    class Config:
        schema_extra = {
            "example": {
                "verdict": "Likely True",
                "score": 0.72,
                "evidence": [
                    {
                        "type": "article",
                        "source": "BBC News",
                        "title": "COVID-19 vaccine proven effective",
                        "url": "https://bbc.com/news/...",
                        "sim": 0.81
                    },
                    {
                        "type": "tweet",
                        "text": "Just saw the BBC confirming vaccine effectiveness!",
                        "sim": 0.65
                    }
                ]
            }
        }
