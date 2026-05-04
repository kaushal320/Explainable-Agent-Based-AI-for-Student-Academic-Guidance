"""
RAG retrieval sanity check against data/eval_gold.json.
Requires working MONGODB_URI, Atlas vector index, and seeded knowledge_base.

Run from repo root:
  python scripts/eval_rag.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def main() -> None:
    from app.core.config import settings
    from app.db.mongodb import db_manager
    from app.services.rag_service import rag_service

    gold_path = ROOT / "data" / "eval_gold.json"
    cases = json.loads(gold_path.read_text(encoding="utf-8"))

    db_manager.connect()
    confident = 0
    for c in cases:
        q = c["query"]
        pack = rag_service.retrieve_for_answer(q)
        best = pack.get("best_vector_score", 0.0)
        gap = pack.get("knowledge_gap", True)
        if not gap:
            confident += 1
        print(f"Q: {q[:72]}…" if len(q) > 72 else f"Q: {q}")
        print(f"   best_vector_score={best:.4f}  knowledge_gap={gap}  k={len(pack.get('citations', []))}")

    print("---")
    print(
        f"Cases with confident retrieval (score >= {settings.RAG_MIN_VECTOR_SCORE}): "
        f"{confident}/{len(cases)}"
    )
    db_manager.close()


if __name__ == "__main__":
    main()
