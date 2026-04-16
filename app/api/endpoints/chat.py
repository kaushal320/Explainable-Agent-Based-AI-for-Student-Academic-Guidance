from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from ...models.chat import ChatRequest, ChatResponse
from ...services.chat_service import ChatService
from ...services.auth_service import require_user

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, current_user: dict = Depends(require_user)):
    try:
        response_text = ChatService.get_response(request)
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/stream")
async def chat_stream(request: ChatRequest, current_user: dict = Depends(require_user)):
    try:
        return StreamingResponse(
            ChatService.get_streaming_response(request),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
