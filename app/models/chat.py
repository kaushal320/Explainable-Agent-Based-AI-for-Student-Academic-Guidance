from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    prompt: str
    history: List[ChatMessage]
    context: Dict

class SourceCitation(BaseModel):
    index: int
    content_preview: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    vector_score: Optional[float] = None
    rerank_score: Optional[float] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[SourceCitation] = Field(default_factory=list)
    knowledge_gap: bool = False
