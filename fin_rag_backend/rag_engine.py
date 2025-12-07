import os
import json
import math
from google.genai import Client
from dotenv import load_dotenv

load_dotenv()

EMBEDDINGS_FILE = os.path.join(os.path.dirname(__file__), "embeddings.json")

class RAGEngine:
    def __init__(self):
        self.client = self._get_client()
        self.chunks = self._load_embeddings()

    def _get_client(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return None
        return Client(api_key=api_key)

    def _load_embeddings(self):
        if os.path.exists(EMBEDDINGS_FILE):
            with open(EMBEDDINGS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def _cosine_similarity(self, vec1, vec2):
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return dot_product / (norm1 * norm2)

    def _generate_text(self, prompt: str, system_prompt: str = None) -> str:
        """Helper to call Gemini generation."""
        try:
            contents = []
            if system_prompt:
                contents.append({"role": "user", "parts": [{"text": system_prompt}]})
            contents.append({"role": "user", "parts": [{"text": prompt}]})
            
            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=contents
            )
            
            answer = ""
            # Robust response parsing
            if hasattr(response, 'candidates'):
                candidates = response.candidates
            elif hasattr(response, 'response') and hasattr(response.response, 'candidates'):
                 candidates = response.response.candidates
            else:
                 candidates = getattr(response, 'candidates', [])

            for candidate in candidates:
                if hasattr(candidate.content, 'parts'):
                    for part in candidate.content.parts:
                        if part.text:
                            answer += part.text
            return answer
        except Exception as e:
            print(f"Generation error: {e}")
            return ""

    def contextualize_query(self, query: str, history: list) -> str:
        """
        Uses conversation history to rewrite the query + standalone.
        """
        if not history:
            return query
            
        # Format history for prompt
        # Assuming history is list of dicts: [{"role": "user", "content": "..."}, ...]
        # We take last 2 turns to avoid context overflow for simple rephrasing
        recent_history = history[-4:] 
        
        hist_text = ""
        for h in recent_history:
            role = h.get("role", "unknown")
            content = h.get("content", "") or h.get("message", "") # Handle flexible keys
            hist_text += f"{role}: {content}\n"
            
        system_prompt = """You are a helpful assistant that rewrites a user's question to be standalone, based on the conversation history. 
        If the history is not relevant, return the query as is.
        Do NOT answer the question. Just return the rewording."""
        
        prompt = f"""Conversation History:
        {hist_text}
        
        User's latest question: {query}
        
        Rewritten standalone question:"""
        
        new_query = self._generate_text(prompt, system_prompt)
        return new_query.strip() if new_query else query

    def expand_query(self, query: str) -> list:
        """
        Generates 3 variations of the query to improve retrieval coverage.
        """
        system_prompt = """You are a search query optimizer. Generate 3 different search queries based on the user's input.
        The queries should cover different aspects or terms related to the user's intent to find the best financial documents.
        Return ONLY the 3 queries, separated by newlines. No numbering."""
        
        prompt = f"User input: {query}"
        
        variations_text = self._generate_text(prompt, system_prompt)
        variations = [v.strip() for v in variations_text.split('\n') if v.strip()]
        
        # Ensure original query is included
        unique_queries = list(set([query] + variations))
        return unique_queries[:4] # Cap at original + 3

    def retrieve(self, queries: list, top_k: int = 5, persona: str = "default"):
        if not self.client:
             raise ValueError("GEMINI_API_KEY not configured")
             
        all_scored_chunks = []
        seen_ids = set()
        
        # Filter chunks based on persona
        # - Default: Use everything (or just general? Let's use everything for max coverage)
        # - Persona: Use Specific Persona + General (to keep Indian context)
        topic_chunks = self.chunks
        if persona and persona != "default":
            topic_chunks = [c for c in self.chunks if c.get("persona") == persona or c.get("persona") == "general"]
        
        for q in queries:
            # Generate query embedding
            try:
                emb_res = self.client.models.embed_content(
                    model="gemini-embedding-001",
                    contents=[q]
                )
                query_embedding = emb_res.embeddings[0].values
                
                # Rank chunks for this specific query
                for chunk in topic_chunks:
                    score = self._cosine_similarity(query_embedding, chunk["embedding"])
                    
                    # We slightly penalize generated queries? No, let's trust them.
                    
                    if chunk["id"] not in seen_ids:
                        chunk_copy = chunk.copy()
                        chunk_copy["score"] = score
                        if "embedding" in chunk_copy:
                             del chunk_copy["embedding"]
                        all_scored_chunks.append(chunk_copy)
                        seen_ids.add(chunk["id"])
                    else:
                        # If already seen, maybe update score if this query matches better?
                        # For simplicity, we keep first occurence (usually from original query if first)
                        pass
            except Exception as e:
                print(f"Retrieval error for query '{q}': {e}")
                continue
            
        all_scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        return all_scored_chunks[:top_k]

    def chat(self, query: str, history: list = None, locale: str = "en-IN", persona: str = "default", lite_mode: bool = True):
        if not self.client:
             raise ValueError("GEMINI_API_KEY not configured")

        # 1. Contextualize
        standalone_query = self.contextualize_query(query, history)
        
        # 2. Expand (Skip in lite_mode to save 4+ API calls)
        if lite_mode:
            search_queries = [standalone_query]
            print(f"Lite Mode Search: {search_queries}")
        else:
            search_queries = self.expand_query(standalone_query)
            print(f"Expanded Search: {search_queries}")
        
        # 3. Retrieve
        context_chunks = self.retrieve(search_queries, top_k=5, persona=persona)
        context_text = "\n\n".join(
            f"--- Source: {c.get('title', 'Unknown')} (Section: {c.get('section', 'General')}) ---\n{c['text']}" 
            for c in context_chunks
        )
        
        # 4. Augment (System Prompt + CoT)
        
        persona_style = ""
        if persona.lower() == "naval":
            persona_style = """
            STYLE: Naval Ravikant.
            - Be concise, direct, and philosophical.
            - Focus on wealth creation (assets) vs status games.
            - "Wealth is assets that earn while you sleep."
            - Explain things simply but profoundly.
            - AVOID jargon unless necessary.
            """
        elif persona.lower() == "ray":
            persona_style = """
            STYLE: Ray Dalio.
            - Think in 'Principles'.
            - View the economy as a machine.
            - Be radically transparent and data-driven.
            - "Pain + Reflection = Progress".
            - Break down complex concepts into cause-and-effect steps.
            """
        elif persona.lower() == "buffett":
            persona_style = """
            STYLE: Warren Buffett.
            - Use folksy wisdom and simple analogies (e.g., hamburgers, baseball).
            - Focus on long-term value and patience.
            - "Rule No. 1: Never lose money."
            - Speak like a wise, patient grandfather explaining to a child.
            """
        
        system_prompt = f"""You are a helpful and responsible financial education assistant for users in {locale if locale else 'India'}.
        
        {persona_style}

        STRICT GUARDRAILS:
        1. DO NOT give personalized financial advice.
        2. DO NOT recommend specific stocks or crypto.
        3. DO NOT promise specific returns.
        4. Suggest consulting a professional for specifics.
        
        INSTRUCTIONS:
        1. **FORMATTING IS CRITICAL**: Output your answer in the following STRICT Markdown format:
           
           ### 💡 The Core Concept
           (One simple sentence explaining the main idea)

           ### 👣 Step-by-Step Guide
           1. **Step 1**: ...
           2. **Step 2**: ...
           (Keep steps simple, like teaching a 5th grader)

           ### 🎯 Key Takeaway
           (A single bold sentence summarizing the advice)

        2. **SIMPLICITY**: Avoid jargon. Use emojis occasionally to make it friendly.
        3. **THINK STEP-BY-STEP**: Analyze the user's intent first.
        4. Use the retrieved CONTEXT to formulate your answer.
        5. Prioritize Indian instruments (SIP, PPF, etc.) if locale is India.
        """
        
        prompt = f"""CONTEXT:
        {context_text}
        
        USER QUESTION:
        {standalone_query} (Original: {query})
        """
        
        answer = self._generate_text(prompt, system_prompt)
                    
        return {
            "answer": answer,
            "sources": context_chunks
        }
