import json
import logging
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage

from ..core.config import settings
from ..core.lifespan import ml_models
from ..models.chat import ChatRequest, ChatMessage
from .rag_service import rag_service

logger = logging.getLogger(__name__)


@tool
def search_academic_knowledge_base(query: str) -> str:
    """Semantic search over uploaded syllabi, career guides, and ingested materials (vector database)."""
    try:
        hits = rag_service.query_documents(query, limit=5)
        if not hits:
            return "No matching passages."
        lines = []
        for i, h in enumerate(hits, 1):
            src = (h.get("metadata") or {}).get("source", "kb")
            body = (h.get("content") or "")[:700]
            lines.append(f"[{i}] ({src}) {body}")
        return "\n\n".join(lines)
    except Exception as e:
        return f"Search failed: {e}"


@tool
def get_career_catalog_excerpt(career_title: str) -> str:
    """Structured beginner→advanced path from the local career catalog (CSV)."""
    if ml_models.content_df is None:
        return "Catalog not available."
    row = ml_models.content_df[ml_models.content_df["career"] == career_title]
    if row.empty:
        return f"No catalog row for '{career_title}'."
    r = row.iloc[0]
    return json.dumps({
        "career": career_title,
        "beginner": str(r.get("beginner", "")),
        "intermediate": str(r.get("intermediate", "")),
        "advanced": str(r.get("advanced", "")),
        "projects": str(r.get("projects", "")),
        "tools": str(r.get("tools", "")),
    })


TOOLS = [search_academic_knowledge_base, get_career_catalog_excerpt]


class AgentService:
    @staticmethod
    def _llm():
        if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "your_api_key_here":
            raise ValueError("Groq API Key missing")
        return ChatGroq(
            temperature=0.35,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=settings.GROQ_API_KEY,
            max_tokens=1200,
        ).bind_tools(TOOLS)

    @staticmethod
    def _history_to_messages(history):
        msgs = []
        for msg in history[-12:]:
            if isinstance(msg, ChatMessage):
                role, content = msg.role, msg.content
            else:
                role = msg.get("role", "user")
                content = msg.get("content", "")
            if role == "user":
                msgs.append(HumanMessage(content=content))
            else:
                msgs.append(AIMessage(content=content))
        return msgs

    @staticmethod
    def _tool_call_parts(tc):
        if isinstance(tc, dict):
            return tc.get("name"), tc.get("args") or {}, tc.get("id") or ""
        return (
            getattr(tc, "name", None),
            getattr(tc, "args", None) or {},
            getattr(tc, "id", "") or "",
        )

    @staticmethod
    def run(request: ChatRequest) -> str:
        llm = AgentService._llm()
        career = request.context.get("career", "IT professional")
        weakness = request.context.get("top_weakness", "general studies")
        gpa = request.context.get("skills", {}).get("GPA", "n/a")

        system = f"""You are a multi-step academic guidance agent with tools.
Call tools when you need factual grounding from the knowledge base or catalog.
Then answer in clear Markdown for the student.

Student context: target career={career}, priority weakness={weakness}, GPA={gpa}.
Prefer verified tool output over guessing; summarize tool content in your own words."""

        messages = [SystemMessage(content=system)]
        messages.extend(AgentService._history_to_messages(request.history))
        messages.append(HumanMessage(content=request.prompt))

        tool_map = {t.name: t for t in TOOLS}
        max_steps = 6

        for _ in range(max_steps):
            ai = llm.invoke(messages)
            messages.append(ai)
            tool_calls = getattr(ai, "tool_calls", None) or []
            if not tool_calls:
                return (ai.content or "").strip() or "(No response text)"

            for tc in tool_calls:
                name, args, tid = AgentService._tool_call_parts(tc)
                fn = tool_map.get(name)
                if fn is None:
                    obs = f"Unknown tool: {name}"
                else:
                    try:
                        obs = fn.invoke(args)
                    except Exception as e:
                        obs = str(e)
                messages.append(ToolMessage(content=str(obs)[:8000], tool_call_id=tid))

        return "⚠️ Agent stopped after the maximum number of tool rounds; try a narrower question."
