from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from starlette.middleware.trustedhost import TrustedHostMiddleware
from .api.endpoints import predict, chat, learning, knowledge, auth, feedback, stt

from .core.lifespan import lifespan
from .core.config import settings
import logging
import time
from collections import defaultdict, deque

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Student Career Guidance API",
    description="A production-style API for personalized academic guidance and career prediction.",
    version="1.0.0",
    lifespan=lifespan
)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response: Response = await call_next(request)
        # Basic hardening headers (works behind HTTPS in production).
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
        # A light CSP for APIs (no HTML rendering here).
        response.headers.setdefault("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none';")
        if settings.ENV.lower() == "prod":
            # HSTS only makes sense when actually served over HTTPS.
            response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Reject unexpected Host headers (basic SSRF / cache-poisoning hardening)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)

class BodySizeLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        cl = request.headers.get("content-length")
        if cl:
            try:
                if int(cl) > settings.MAX_REQUEST_BODY_BYTES:
                    return Response("Request too large", status_code=413)
            except ValueError:
                pass
        return await call_next(request)

app.add_middleware(BodySizeLimitMiddleware)

class SimpleRateLimitMiddleware(BaseHTTPMiddleware):
    """
    In-memory sliding window limiter (good for demo / single-process).
    Production note: use Redis-based limiter at the edge/API gateway.
    """
    _buckets = defaultdict(lambda: deque())

    async def dispatch(self, request, call_next):
        # Skip docs/assets to avoid noisy throttling in dev.
        if request.url.path.startswith(("/docs", "/openapi.json", "/redoc")):
            return await call_next(request)

        ip = request.client.host if request.client else "unknown"
        key = f"{ip}:{request.url.path}"
        now = time.time()
        window = 60.0
        q = self._buckets[key]
        while q and (now - q[0]) > window:
            q.popleft()
        if len(q) >= settings.RATE_LIMIT_PER_MINUTE:
            return Response("Too Many Requests", status_code=429)
        q.append(now)
        return await call_next(request)

app.add_middleware(SimpleRateLimitMiddleware)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
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
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(stt.router, prefix="/api/stt", tags=["Speech-to-Text"])

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Student Career Guidance API. Visit /docs for documentation."}
