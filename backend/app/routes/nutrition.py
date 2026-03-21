import os
import json
import base64
from fastapi import APIRouter, HTTPException, Request
from app.models import NutritionLogCreate
from app.database import nutrition_logs_collection, users_collection
import google.generativeai as genai
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/nutrition", tags=["nutrition"])

# Gemini Config
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

@router.post("/analyze")
async def analyze_food(req: dict):
    if not api_key:
        return {"results": [{"name": "Sample (Key Missing)", "kcal": 150, "protein": 6}]}
    
    prompt = req.get("prompt")
    image_data = req.get("image")
    
    content = [prompt]
    if image_data:
        if "," in image_data:
            _, data = image_data.split(",", 1)
        else:
            data = image_data
        content.append({"mime_type": "image/jpeg", "data": base64.b64decode(data)})
        
    try:
        response = model.generate_content(content)
        text = response.text
        
        # Extract JSON
        start = text.find('[')
        end = text.rfind(']') + 1
        if start != -1 and end > 0:
            results = json.loads(text[start:end])
            return {"results": results}
        
        # Fallback to {...}
        start = text.find('{')
        end = text.rfind('}') + 1
        if start != -1 and end > 0:
            results = json.loads(text[start:end])
            return {"results": [results] if isinstance(results, dict) else results}
            
        raise HTTPException(status_code=500, detail="AI response parsing error")
    except Exception as e:
        print(f"Nutrition AI Error: {e}")
        return {"results": []}

@router.post("/log")
async def log_nutrition(log: NutritionLogCreate):
    log_dict = log.dict()
    log_dict["timestamp"] = datetime.utcnow()
    result = await nutrition_logs_collection.insert_one(log_dict)
    return {"status": "success", "id": str(result.inserted_id)}

@router.get("/today/{user_id}")
async def get_today_nutrition(user_id: str):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    cursor = nutrition_logs_collection.find({
        "user_id": user_id,
        "timestamp": {"$gte": today}
    })
    logs = await cursor.to_list(length=100)
    
    total_kcal = sum(l["kcal"] for l in logs)
    total_protein = sum(l["protein"] for l in logs)
    
    return {
        "logs": logs,
        "summary": {"kcal": total_kcal, "protein": total_protein}
    }
