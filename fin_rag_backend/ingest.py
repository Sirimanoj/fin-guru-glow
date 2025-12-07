import os
import json
import time
from google.genai import Client
from dotenv import load_dotenv

load_dotenv()

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
EMBEDDINGS_FILE = os.path.join(os.path.dirname(__file__), "embeddings.json")

def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in .env")
    return Client(api_key=api_key)

def get_embedding(client, text: str):
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=[text]
    )
    return response.embeddings[0].values

def load_and_chunk_data():
    all_chunks = []
    client = get_client()
    
    if not os.path.exists(DATA_DIR):
        print(f"Data directory not found: {DATA_DIR}")
        return []

    print(f"Scanning {DATA_DIR}...")
    for filename in os.listdir(DATA_DIR):
        if not filename.endswith(".json"):
            continue
            
        print(f"Processing {filename}...")
        filepath = os.path.join(DATA_DIR, filename)
        
        with open(filepath, "r", encoding="utf-8") as f:
            articles = json.load(f)
            
        for article in articles:
            # We treat each article as a chunk for now since they are short (200-500 words goal)
            # If they were longer, we'd split `content` further.
            
            text_to_embed = f"{article['title']}\n{article['content']}"
            
            try:
                # Determine persona from filename
                persona_tag = "general"
                if "naval" in filename.lower():
                    persona_tag = "naval"
                elif "ray" in filename.lower():
                    persona_tag = "ray"
                elif "buffett" in filename.lower():
                    persona_tag = "buffett"

                embedding = get_embedding(client, text_to_embed)
                chunk = {
                    "id": article['id'],
                    "title": article['title'],
                    "section": article['section'],
                    "source": filename,
                    "persona": persona_tag, 
                    "text": article['content'],
                    "embedding": embedding
                }
                all_chunks.append(chunk)
                print(f"Embedded: {article['title']} (Persona: {persona_tag})")
                # Rate limiting safe guard
                time.sleep(0.5) 
            except Exception as e:
                print(f"Error embedding {article['title']}: {e}")
            
    return all_chunks

if __name__ == "__main__":
    try:
        chunks = load_and_chunk_data()
        with open(EMBEDDINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(chunks, f, ensure_ascii=False, indent=2)
        print(f"Successfully saved {len(chunks)} chunks to {EMBEDDINGS_FILE}")
    except Exception as e:
        print(f"Failed to ingest data: {e}")
