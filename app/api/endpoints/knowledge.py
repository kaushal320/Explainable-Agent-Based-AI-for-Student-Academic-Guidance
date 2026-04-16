from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from pydantic import BaseModel
from ...services.rag_service import rag_service
from ...services.auth_service import require_user

router = APIRouter()

class TextInput(BaseModel):
    text: str
    source: str = "manual_entry"

@router.post("/upload/text")
async def upload_knowledge_text(data: TextInput, current_user: dict = Depends(require_user)):
    """Allows uploading raw text (like a scraped website or syllabus) directly to the brain."""
    try:
        result = rag_service.add_documents(data.text, metadata={"source": data.source})
        return {"message": "Knowledge successfully ingested!", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload/file")
async def upload_knowledge_file(file: UploadFile = File(...), current_user: dict = Depends(require_user)):
    """Allows uploading a text document."""
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .txt files are supported for now.")
    
    try:
        content = await file.read()
        text = content.decode("utf-8")
        result = rag_service.add_documents(text, metadata={"source": file.filename})
        return {"message": f"Successfully ingested {file.filename}!", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search")
async def search_knowledge(query: str, limit: int = 4, current_user: dict = Depends(require_user)):
    try:
        results = rag_service.query_documents(query, limit=limit)
        return {"query": query, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
