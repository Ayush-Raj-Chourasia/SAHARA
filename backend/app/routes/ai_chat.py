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
    
    # Context gathering (RAG-lite)
    # Fetch last 3 health logs for context
    cursor = health_logs_collection.find({"user_id": user_id}).sort("timestamp", -1).limit(3)
    logs = await cursor.to_list(length=3)
    
    context_str = ""
    if logs:
        context_str = "Latest health data for the user:\n"
        for l in logs:
            context_str += f"- BP: {l['bp_sys']}/{l['bp_dia']}, Sugar: {l['sugar']}, HR: {l['heart_rate']} (Logged at: {l['timestamp']})\n"

    system_prompt = f"""
    You are SAHARA AI, a specialized health companion for elderly citizens in India.
    {context_str}
    User Question: {message}
    
    Guidelines:
    1. Be extremely respectful and empathetic.
    2. Provide advice based on the provided health data.
    3. Use simple language (prefer English mixed with Hindi/Odia terms if appropriate).
    4. Focus on preventive care and when to see a doctor.
    5. NEVER provide a formal medical diagnosis.
    """

    try:
        response = model.generate_content(system_prompt)
        return {"response": response.text}
    except Exception as e:
        print(f"Chatbot Error: {e}")
        return {"response": "I'm sorry, I'm having trouble connecting right now. Please try again later."}
