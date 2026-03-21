from fastapi import APIRouter, HTTPException
from app.database import (
    health_logs_collection,
    nutrition_logs_collection,
    users_collection,
    ai_chat_messages_collection,
)
import google.generativeai as genai
from groq import Groq
import os
from dotenv import load_dotenv
from bson import ObjectId
from datetime import datetime

load_dotenv()

router = APIRouter(prefix="/api/ai", tags=["ai"])

# Gemini Config
api_key = os.getenv("GEMINI_API_KEY")
model = None
if api_key:
    genai.configure(api_key=api_key)
    gemini_candidates = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
    ]
    for candidate in gemini_candidates:
        try:
            model = genai.GenerativeModel(candidate)
            print(f"✅ Gemini initialized with {candidate}")
            break
        except Exception:
            continue
    if model is None:
        print("⚠️ Gemini initialization failed for all configured models")

# Groq Config (Primary Fallback)
groq_key = os.getenv("GROQ_API_KEY")
groq_client = None
if groq_key:
    groq_client = Groq(api_key=groq_key)
    print("✅ Groq client ready for AI chat fallback")

@router.post("/chat")
async def health_chat(req: dict):
    """Health chatbot with RAG pattern - context-aware responses"""
    user_id = req.get("user_id", "unknown")
    user_email = (req.get("user_email") or "").strip().lower()
    message = req.get("message", "").strip()
    language = req.get("language", "en")
    
    if not message:
        return {"response": "Please ask me something about your health."}
    
    # Context gathering (Full RAG Pattern)
    user = None
    try:
        if user_id and ObjectId.is_valid(user_id):
            user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if user is None and user_email:
            user = await users_collection.find_one({"email": user_email})
    except Exception as db_err:
        print(f"⚠️ AI chat user context unavailable: {db_err}")
    if user is None and user_id:
        try:
            user = await users_collection.find_one({"id": user_id})
        except Exception:
            pass

    effective_user_id = str(user.get("_id")) if user else user_id
    effective_email = user.get("email") if user else user_email

    name = user.get("name", "User").replace(" Ji", "").strip() if user else "Senior"  # Remove duplicate Ji
    age = user.get("age", 70) if user else 70
    gender = user.get("gender", "other") if user else "other"
    conditions = user.get("conditions", []) if user else []
    
    # Get latest health logs for context
    try:
        cursor = health_logs_collection.find({"user_id": effective_user_id}).sort("timestamp", -1).limit(7)
        latest_logs = await cursor.to_list(length=7)
    except Exception as db_err:
        print(f"⚠️ AI chat health context unavailable: {db_err}")
        latest_logs = []
    
    latest_log = latest_logs[0] if latest_logs else {}

    # Pull recent nutrition logs for context grounding.
    try:
        n_cursor = nutrition_logs_collection.find({"user_id": effective_user_id}).sort("timestamp", -1).limit(5)
        nutrition_logs = await n_cursor.to_list(length=5)
    except Exception as db_err:
        print(f"⚠️ AI chat nutrition context unavailable: {db_err}")
        nutrition_logs = []

    nutrition_snapshot = [
        f"{item.get('food_name', 'meal')} ({item.get('kcal', 'N/A')} kcal, protein {item.get('protein', item.get('protein_g', 'N/A'))}g)"
        for item in nutrition_logs
    ]

    # Include recent conversation memory from DB.
    try:
        c_cursor = ai_chat_messages_collection.find({"user_id": effective_user_id}).sort("timestamp", -1).limit(6)
        history_rows = await c_cursor.to_list(length=6)
        history_rows.reverse()
        chat_memory = "\n".join(
            [f"User: {row.get('user_message', '')}\nAssistant: {row.get('assistant_message', '')}" for row in history_rows]
        )
    except Exception as db_err:
        print(f"⚠️ AI chat memory unavailable: {db_err}")
        chat_memory = ""
    
    # Build context summary
    context = f"""
User Profile:
- Name: {name}
- Age: {age}
- Gender: {gender}
- Conditions: {', '.join(conditions) if conditions else 'None reported'}

Latest Health Metrics:
- Blood Pressure: {latest_log.get('bp_sys', 'N/A')}/{latest_log.get('bp_dia', 'N/A')} mmHg
- Blood Sugar: {latest_log.get('sugar', 'N/A')} mg/dL
- Heart Rate: {latest_log.get('heart_rate', 'N/A')} bpm
- Health Score: {latest_log.get('score', 'N/A')}/100
- Fatigue Level: {latest_log.get('fatigue', 'N/A')}/10

Recent Nutrition Logs:
- {chr(10).join(nutrition_snapshot) if nutrition_snapshot else 'No recent nutrition logs'}

Recent Conversation Memory:
{chat_memory if chat_memory else 'No previous conversation history'}

User Request: {message}
"""
    
    system_prompt = f"""You are SAHARA, a warm and caring AI health companion for elderly Indians.

STRICT RULES — NEVER BREAK THESE:
1. Never diagnose any disease or condition
2. Always recommend seeing a doctor for symptoms lasting more than 2 days
3. Keep every response under 3 sentences
4. Use simple vocabulary at a Class 5 reading level
5. Respond in the same language the user asks (Hindi, Odia, or English)
6. Address the user by name with 'Ji' suffix (e.g., '{name} Ji')
7. End every response with one warm, practical care tip related to their condition
8. If the user expresses pain or loneliness, acknowledge their feelings first

{context}"""

    try:
        # TRY GEMINI FIRST
        if model:
            print(f"🔵 Calling Gemini API for chat: {message[:50]}...")
            response = model.generate_content([system_prompt, f"\nUser message: {message}"])
            ai_response = response.text.strip()
            print(f"✅ Gemini response: {ai_response[:100]}...")
            
            return {
                "response": ai_response,
                "language": language,
                "context_used": {
                    "user_name": name,
                    "latest_score": latest_log.get("score"),
                    "conditions": conditions
                },
                "source": "gemini"
            }
        else:
            raise Exception("Gemini model not available")
    except Exception as e:
        print(f"❌ Gemini Error: {e}")
        
        # FALLBACK TO GROQ
        if groq_client:
            try:
                print(f"🟢 Calling Groq API for chat: {message[:50]}...")
                chat_completion = groq_client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"User message: {message}"}
                    ],
                    model="llama-3.1-8b-instant"
                )
                ai_response = chat_completion.choices[0].message.content.strip()
                print(f"✅ Groq response: {ai_response[:100]}...")
                
                return {
                    "response": ai_response,
                    "language": language,
                    "context_used": {
                        "user_name": name,
                        "latest_score": latest_log.get("score"),
                        "conditions": conditions
                    },
                    "source": "groq"
                }
            except Exception as groq_err:
                print(f"❌ Groq Error: {groq_err}")
        
        # ULTIMATE FALLBACK - Generate response based on message analysis
        print(f"⚠️ All AI services failed, generating rule-based response")
        response_text = f"{name} Ji, I understand your concern. Please see a doctor if this persists. Make sure to drink plenty of water and get enough rest."
        
        return {
            "response": response_text,
            "language": language,
            "context_used": {
                "user_name": name,
                "latest_score": latest_log.get("score"),
                "conditions": conditions
            },
            "source": "fallback",
            "note": "AI services unavailable - using basic response"
        }
    finally:
        # Persist the conversation turn so future prompts are grounded in prior history.
        try:
            await ai_chat_messages_collection.insert_one(
                {
                    "user_id": effective_user_id,
                    "user_email": effective_email,
                    "user_name": name,
                    "user_message": message,
                    "assistant_message": locals().get("ai_response", locals().get("response_text", "")),
                    "latest_score": latest_log.get("score"),
                    "conditions": conditions,
                    "timestamp": datetime.utcnow(),
                }
            )
        except Exception as persist_err:
            print(f"⚠️ Failed to persist AI chat memory: {persist_err}")
