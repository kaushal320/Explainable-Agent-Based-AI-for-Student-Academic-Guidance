from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import predict, chat, learning, knowledge, auth

from .core.lifespan import lifespan
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Student Career Guidance API",
    description="A production-style API for personalized academic guidance and career prediction.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(predict.router, prefix="/api/predict", tags=["Prediction"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/chat", tags=["Tutoring"])
app.include_router(learning.router, prefix="/api/learning", tags=["Learning Resources"])
app.include_router(knowledge.router, prefix="/api/knowledge", tags=["Knowledge Base (RAG)"])

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Student Career Guidance API. Visit /docs for documentation."}
