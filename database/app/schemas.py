from pydantic import BaseModel
from typing import List, Optional

class QueryIn(BaseModel):
    text: str

class EvidenceItem(BaseModel):
    type: str
    source: Optional[str] = None
    title: Optional[str] = None
    url: Optional[str] = None
    text: Optional[str] = None
    sim: float

class VerifyOut(BaseModel):
    verdict: str
    score: float
    evidence: List[EvidenceItem]
