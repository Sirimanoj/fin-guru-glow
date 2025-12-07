from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from typing import List, Optional
# Force reload for new data
import re
import os
from rag_engine import RAGEngine

app = FastAPI(title="Financial Advisor RAG API")
rag = RAGEngine()

# Serve the HTML frontend
@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open(os.path.join(os.path.dirname(__file__), "static/index.html"), "r") as f:
        return f.read()

class ChatRequest(BaseModel):
    user_id: str
    message: str
    locale: Optional[str] = "en-IN"
    persona: Optional[str] = "default" # naval, ray, buffett
    history: Optional[List[dict]] = []

class SourceObj(BaseModel):
    id: str
    title: str
    section: str
    score: float

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceObj]

def check_guardrails(message: str):
    # Simple regex-based guardrails for high-risk queries
    risk_patterns = [
        r"buy (.*) stock",
        r"invest in (.*) coin",
        r"double my money",
        r"guaranteed return"
    ]
    for pattern in risk_patterns:
        if re.search(pattern, message, re.IGNORECASE):
            return True
    return False

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    # 1. Guardrail Check
    if check_guardrails(req.message):
        return ChatResponse(
            answer="I cannot recommend specific stocks or promise returns. I can help you understand investment principles, risk profiling, and how to evaluate assets. Would you like to know about asset allocation or risk management?",
            sources=[]
        )

    try:
        # 2. RAG Pipeline
        result = rag.chat(req.message, req.history, req.locale, req.persona)
        
        # 3. Response Formatting
        return ChatResponse(
            answer=result["answer"],
            sources=[
                SourceObj(
                    id=s.get("id", "unknown"),
                    title=s.get("title", "Reference"),
                    section=s.get("section", "General"),
                    score=s.get("score", 0.0)
                ) 
                for s in result["sources"]
            ]
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Configuration Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


