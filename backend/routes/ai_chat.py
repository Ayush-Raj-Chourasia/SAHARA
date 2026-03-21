import os
from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

class PatientContext(BaseModel):
    name: str = "User"
    age: int = 60
    gender: str = "unknown"
    health_score: float = 0
    bp_sys: float = 120
    bp_dia: float = 80
    blood_sugar: float = 100
    hemoglobin: float = 14.0
    anemia_label: str = "Unknown"

class AIChatRequest(BaseModel):
    message: str
    patient_context: PatientContext

@router.post("/chat")
async def chat_with_ai(request: AIChatRequest):
    if not GENAI_API_KEY:
        return {"reply": "I am currently unavailable because the API key is not configured.", "error": "Gemini API Key missing"}

    ctx = request.patient_context
    system_prompt = (
        "You are SAHARA, a caring AI health companion for elderly Indians.\n"
        "RULES — NEVER BREAK:\n"
        "1. Never diagnose any disease\n"
        "2. Always say 'see a doctor' for serious symptoms\n"
        "3. Max 3 sentences per reply\n"
        "4. Simple vocabulary only — Class 5 reading level\n"
        "5. Reply in same language the user writes (Hindi / Odia / English)\n"
        f"6. Address user as '{ctx.name} Ji'\n\n"
        "PATIENT DATA:\n"
        f"Name: {ctx.name}, Age: {ctx.age}, Gender: {ctx.gender}\n"
        f"Health Score: {ctx.health_score}/100\n"
        f"BP: {ctx.bp_sys}/{ctx.bp_dia} | Sugar: {ctx.blood_sugar} | Hb: {ctx.hemoglobin}\n"
        f"Anemia: {ctx.anemia_label}"
    )

    try:
        model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=system_prompt)
        response = model.generate_content(request.message)
        reply = response.text.strip()
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"Sorry {ctx.name} Ji, I am unable to reply right now.", "error": str(e)}
