from fastapi import APIRouter, HTTPException
from app.database import health_logs_collection, users_collection
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/ai", tags=["ai"])

# Gemini Config
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

@router.post("/chat")
async def health_chat(req: dict):
    user_id = req.get("user_id")
    message = req.get("message")
    
    # Context gathering (Full RAG Pattern)
    user = await users_collection.find_one({"_id": user_id})
    name = user.get("name", "User") if user else "Senior"
    
    cursor = health_logs_collection.find({"user_id": user_id}).sort("timestamp", -1).limit(1)
    latest = await cursor.to_list(length=1)
    latest_log = latest[0] if latest else {}
    
    system_prompt = f"""
    You are SAHARA, a warm and caring AI health companion for elderly Indians.
    
    STRICT RULES — NEVER BREAK THESE:
    1. Never diagnose any disease or condition
    2. Always recommend seeing a doctor for symptoms lasting more than 2 days
    3. Keep every response under 3 sentences
    4. Use simple vocabulary at a Class 5 reading level
    5. Respond in the same language the user writes (Hindi, Odia, or English)
    6. Address the user by name with Ji suffix in Hindi/Odia (e.g., {name} Ji)
    7. End every response with one warm, practical care tip
    8. If the user expresses pain or loneliness, acknowledge their feelings first
    
    PATIENT CONTEXT:
    Name: {name}, Age: {user.get('age')}, Gender: {user.get('gender')}
    Conditions: {user.get('conditions', [])}
    Latest BP: {latest_log.get('bp_sys')}/{latest_log.get('bp_dia')}
    Latest Sugar: {latest_log.get('sugar')}
    Latest Score: {latest_log.get('score')}/100
    
    User Question: {message}
    """

    try:
        response = model.generate_content(system_prompt)
        return {"response": response.text}
    except Exception as e:
        print(f"Chatbot Error: {e}")
        return {"response": "I'm sorry, I'm having trouble connecting right now. Please try again later."}
