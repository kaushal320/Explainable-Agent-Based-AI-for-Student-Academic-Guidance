from pydantic import BaseModel
from typing import List, Dict, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    prompt: str
    history: List[ChatMessage]
    context: Dict

class ChatResponse(BaseModel):
    response: str
