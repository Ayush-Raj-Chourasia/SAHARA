import os
import json
import base64
import random
from fastapi import APIRouter, HTTPException, Request
from app.models import NutritionLogCreate
from app.database import nutrition_logs_collection, users_collection
import google.generativeai as genai
from groq import Groq
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/nutrition", tags=["nutrition"])

# Gemini Config
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    gemini_model = None
    gemini_candidates = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
    ]
    for candidate in gemini_candidates:
        try:
            gemini_model = genai.GenerativeModel(candidate)
            print(f"✅ Gemini initialized with {candidate}")
            break
        except Exception:
            continue
    if gemini_model is None:
        print("⚠️ Gemini model initialization failed for all configured models")
else:
    gemini_model = None
    print("⚠️ GEMINI_API_KEY not found")

# Groq Config (Fallback)
groq_key = os.getenv("GROQ_API_KEY")
groq_client = None
if groq_key:
    groq_client = Groq(api_key=groq_key)
    print("✅ Groq client initialized - Using llama-3.1-8b-instant")
else:
    print("⚠️ GROQ_API_KEY not found")

# Fallback Indian meal database for offline/demo mode
COMMON_INDIAN_MEALS = {
    "poha": {"name": "Poha (Flattened Rice)", "kcal": 250, "protein_g": 5, "iron_mg": 2.0, "carbs_g": 50},
    "dal chawal": {"name": "Dal Chawal", "kcal": 450, "protein_g": 14, "iron_mg": 4.0, "carbs_g": 68},
    "roti sabzi": {"name": "Roti with Vegetable Curry", "kcal": 320, "protein_g": 8, "iron_mg": 3.0, "carbs_g": 55},
    "idli sambar": {"name": "Idli with Sambar", "kcal": 300, "protein_g": 9, "iron_mg": 2.5, "carbs_g": 52},
    "khichdi": {"name": "Khichdi", "kcal": 380, "protein_g": 12, "iron_mg": 3.5, "carbs_g": 65},
    "upma": {"name": "Upma (Semolina)", "kcal": 220, "protein_g": 6, "iron_mg": 1.8, "carbs_g": 40},
    "paneer roti": {"name": "Paneer with Roti", "kcal": 520, "protein_g": 22, "iron_mg": 3.2, "carbs_g": 48},
    "egg curry rice": {"name": "Egg Curry with Rice", "kcal": 490, "protein_g": 24, "iron_mg": 4.5, "carbs_g": 52},
    "rajma chawal": {"name": "Rajma with Rice", "kcal": 480, "protein_g": 18, "iron_mg": 5.5, "carbs_g": 72},
    "breakfast": {"name": "Light Breakfast", "kcal": 300, "protein_g": 8, "iron_mg": 2.5, "carbs_g": 48},
}

MEAL_WINDOWS = {
    "breakfast": 10,
    "lunch": 15,
    "snacks": 18,
    "dinner": 22,
}

FOOD_KEYWORDS = {
    "poha", "dal", "chawal", "rice", "roti", "chapati", "idli", "dosa", "upma", "khichdi",
    "paneer", "egg", "milk", "tea", "coffee", "curd", "yogurt", "sabzi", "vegetable", "salad",
    "fruit", "banana", "apple", "mango", "orange", "bread", "paratha", "sambar", "rajma", "chole",
    "snack", "breakfast", "lunch", "dinner",
}


def normalize_meal_type(meal_type: str) -> str:
    mt = (meal_type or "").strip().lower()
    if mt == "snack":
        return "snacks"
    if mt not in MEAL_WINDOWS:
        return "snacks"
    return mt


def detect_meal_type(text: str, fallback: str = "snacks") -> str:
    t = (text or "").lower()
    if any(k in t for k in ["breakfast", "morning", "nashta"]):
        return "breakfast"
    if any(k in t for k in ["lunch", "afternoon"]):
        return "lunch"
    if any(k in t for k in ["dinner", "night", "supper"]):
        return "dinner"
    if any(k in t for k in ["snack", "snacks", "evening"]):
        return "snacks"
    return normalize_meal_type(fallback)


def looks_like_food_text(text: str) -> bool:
    t = (text or "").lower()
    return any(k in t for k in FOOD_KEYWORDS)


def sanitize_ai_meals(meals: list, meal_text: str, meal_type: str) -> list:
    safe = []
    for m in meals or []:
        name = str(m.get("name", "")).strip()
        if not name:
            continue
        # Keep only entries that look food-like by either meal text context or meal name keyword match.
        lowered_name = name.lower()
        if not looks_like_food_text(lowered_name) and not looks_like_food_text(meal_text):
            continue
        kcal = int(float(m.get("kcal", 0) or 0))
        protein = float(m.get("protein_g", m.get("protein", 0)) or 0)
        iron = float(m.get("iron_mg", 0) or 0)
        if kcal <= 0 and protein <= 0 and iron <= 0:
            continue
        safe.append({
            "name": name,
            "kcal": kcal,
            "protein_g": round(protein, 1),
            "iron_mg": round(iron, 1),
            "meal_type": normalize_meal_type(meal_type),
        })
    return safe

@router.post("/analyze")
async def analyze_food(req: dict):
    meal_text = req.get("prompt", "").strip()
    image_data = req.get("image")
    requested_meal_type = normalize_meal_type(req.get("meal_type", "snacks"))
    inferred_meal_type = detect_meal_type(meal_text, requested_meal_type)
    
    if not meal_text:
        return {"results": []}

    if not looks_like_food_text(meal_text):
        return {
            "results": [],
            "source": "validator",
            "status": "no_food_detected",
            "note": "No edible item detected in speech input.",
        }
    
    # System prompt for structured nutrition analysis
    system_message = """You are a clinical nutritionist specializing in elderly Indian nutrition (60-85 years old).

Analyze the meal(s) described and return ONLY valid JSON in this exact format:
{
  "meals": [
    {
      "name": "Food name in English",
      "kcal": 450,
      "protein_g": 14,
      "iron_mg": 4.0,
      "carbs_g": 68,
      "calcium_mg": 200
    }
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no markdown, no explanation
- Include nutrition values based on typical Indian serving sizes
- For Hindi meal names, translate to English in the 'name' field
- If multiple foods mentioned, list them separately in meals array
- Include key nutrients: calories, protein, iron, carbs, calcium"""
    
    content = [system_message, f"Meal description: {meal_text}"]
    
    if image_data:
        try:
            if "," in image_data:
                _, data = image_data.split(",", 1)
            else:
                data = image_data
            content.append({"mime_type": "image/jpeg", "data": base64.b64decode(data)})
        except Exception as img_err:
            print(f"Image decode error: {img_err}")
    
    # PRIMARY: Try Gemini API (Google)
    if api_key and gemini_model:
        try:
            print(f"🔵 Calling Gemini API for: {meal_text[:50]}...")
            response = gemini_model.generate_content(content)
            text = response.text.strip()
            print(f"✅ Gemini raw response: {text[:150]}...")
            result = parse_ai_json(text)
            if result.get("meals"):
                meals = sanitize_ai_meals(result.get("meals"), meal_text, inferred_meal_type)
                if not meals:
                    raise ValueError("AI output did not include edible items")
                print(f"✅ Gemini parsed {len(meals)} meals successfully")
                meals_with_tips = add_dynamic_care_tips(meals, meal_text)
                return {"results": meals_with_tips, "source": "gemini", "status": "success"}
        except Exception as e:
            print(f"❌ Gemini Error: {type(e).__name__}: {str(e)[:150]}")
    
    # FALLBACK 1: Try Groq API (Llama) - Using llama-3.1-8b-instant (available model)
    if groq_client:
        try:
            print(f"🟢 Falling back to Groq API (llama-3.1-8b-instant) for: {meal_text[:50]}...")
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": f"Meal description: {meal_text}"}
                ],
                model="llama-3.1-8b-instant"  # Using available model
            )
            text = chat_completion.choices[0].message.content
            print(f"✅ Groq raw response: {text[:150]}...")
            result = parse_ai_json(text)
            if result.get("meals"):
                meals = sanitize_ai_meals(result.get("meals"), meal_text, inferred_meal_type)
                if not meals:
                    raise ValueError("AI output did not include edible items")
                print(f"✅ Groq parsed {len(meals)} meals successfully")
                meals_with_tips = add_dynamic_care_tips(meals, meal_text)
                return {"results": meals_with_tips, "source": "groq", "status": "success"}
        except Exception as ge:
            print(f"❌ Groq Error: {type(ge).__name__}: {str(ge)[:150]}")
    
    # FALLBACK 2: Check hardcoded database only if AI fails
    print(f"🟡 AI services unavailable, checking fallback database...")
    meal_text_lower = meal_text.lower()
    for key, meal in COMMON_INDIAN_MEALS.items():
        if key in meal_text_lower:
            print(f"✅ Using fallback database for: {key}")
            meal_with_type = dict(meal)
            meal_with_type["meal_type"] = inferred_meal_type
            return {"results": [meal_with_type], "source": "database", "status": "ai_failed_using_fallback"}

    print(f"⚠️ Could not validate edible item in fallback database for: {meal_text}")
    return {
        "results": [],
        "source": "validator",
        "status": "no_food_detected",
        "note": "Could not identify an edible item from speech.",
    }

def parse_ai_json(text: str):
    """Extract and parse JSON from AI response"""
    try:
        # Try to find JSON object or array
        start_obj = text.find('{')
        start_arr = text.find('[')
        
        # Determine which comes first
        if start_obj == -1 and start_arr == -1:
            return {}
        
        if start_obj != -1 and (start_arr == -1 or start_obj < start_arr):
            # Object format
            end = text.rfind('}') + 1
            if end > start_obj:
                json_str = text[start_obj:end]
                return json.loads(json_str)
        else:
            # Array format
            end = text.rfind(']') + 1
            if end > start_arr:
                json_str = text[start_arr:end]
                return {"meals": json.loads(json_str)}
    except json.JSONDecodeError as je:
        print(f"JSON Parse Error: {je}")
    
    return {}

def add_dynamic_care_tips(meals, meal_text):
    """Add dynamic care tips based on what was actually eaten, not generic tips"""
    care_tips_map = {
        "poha": "Poha is light on stomach. Good for breakfast. Make sure to drink water after eating.",
        "dal": "Dal is rich in protein and iron. Perfect for elderly nutrition. Include in daily meals.",
        "idli": "Idli is easy to digest. Soft texture is perfect for your age. Eat with fresh sambar.",
        "dosa": "Dosa has good carbs and protein. Light meal option. Great with chutney.",
        "chapati": "Chapati provides fiber and energy. Pair with vegetables for complete nutrition.",
        "rice": "Rice is gentle on digestion. Combine with lentils or vegetables for better nutrition.",
        "sambar": "Sambar has vegetables and spices good for digestion. Perfect with rice or idli.",
        "paneer": "Paneer is high in calcium and protein. Great for bone health in elderly.",
        "khichdi": "Khichdi is one of the easiest to digest. Perfect comfort food for any age.",
        "upma": "Upma is nutritious and filling. Good breakfast option with minerals and fiber.",
        "tea": "Tea in moderation is fine. Avoid too much caffeine - once a day is enough.",
        "curry": "Curry with vegetables adds nutrients. Keep spice level moderate for digestion.",
        "vegetable": "Vegetables provide vitamins and minerals. Eat seasonal vegetables for best nutrition.",
        "egg": "Eggs are excellent protein source for elderly. Include 4-5 per week for good health.",
        "milk": "Milk is important for calcium. Drink warm milk daily for better sleep and bones.",
    }
    
    # Find which meal type was actually mentioned
    meal_text_lower = meal_text.lower()
    dynamic_tip = None
    for key, tip in care_tips_map.items():
        if key in meal_text_lower:
            dynamic_tip = tip
            break
    
    # If no specific meal found, create a generic but relevant tip
    if not dynamic_tip:
        dynamic_tip = f"You ate {meal_text}. Good nutrition choice. Drink plenty of water along with meals."
    
    # Add care_tip to each meal
    meals_with_tips = []
    for meal in meals:
        meal["care_tip"] = dynamic_tip
        meals_with_tips.append(meal)
    
    return meals_with_tips

@router.post("/log")
async def log_nutrition(log: NutritionLogCreate):
    try:
        log_dict = log.dict()
        log_dict["meal_type"] = normalize_meal_type(log.meal_type)
        log_dict["timestamp"] = datetime.utcnow()
        result = await nutrition_logs_collection.insert_one(log_dict)
        return {"status": "success", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database write failed: {str(e)}")


@router.post("/auto-log/{user_id}")
async def auto_log_nutrition(user_id: str, meal_type: str = "snacks"):
    """Simulate auto-fetch nutrition entry for a meal label and persist it."""
    mt = normalize_meal_type(meal_type)
    picks = list(COMMON_INDIAN_MEALS.values())
    meal = random.choice(picks)
    entry = NutritionLogCreate(
        user_id=user_id,
        meal_type=mt,
        food_name=meal.get("name", "Auto Meal"),
        kcal=int(meal.get("kcal", random.randint(220, 520))),
        protein=float(meal.get("protein_g", random.randint(6, 24))),
        iron_mg=float(meal.get("iron_mg", round(random.uniform(1.2, 5.8), 1))),
    )
    return await log_nutrition(entry)

@router.get("/today/{user_id}")
async def get_today_nutrition(user_id: str):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    try:
        cursor = nutrition_logs_collection.find({
            "user_id": user_id,
            "timestamp": {"$gte": today}
        })
        logs = await cursor.to_list(length=100)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database read failed: {str(e)}")

    for l in logs:
        l["_id"] = str(l["_id"])
        l["meal_type"] = normalize_meal_type(l.get("meal_type", "snacks"))
    
    def to_num(v, fallback=0.0):
        try:
            return float(v)
        except Exception:
            return fallback

    total_kcal = sum(to_num(l.get("kcal", 0), 0.0) for l in logs)
    total_protein = sum(to_num(l.get("protein", 0), 0.0) for l in logs)

    by_meal = {k: None for k in MEAL_WINDOWS.keys()}
    for meal in MEAL_WINDOWS.keys():
        meal_logs = [l for l in logs if normalize_meal_type(l.get("meal_type", "snacks")) == meal]
        if meal_logs:
            meal_logs.sort(key=lambda x: x.get("timestamp") or datetime.min, reverse=True)
            by_meal[meal] = meal_logs[0]

    now_hour = datetime.utcnow().hour
    meal_status = []
    for meal, due_hour in MEAL_WINDOWS.items():
        logged = by_meal[meal] is not None
        missed = (now_hour >= due_hour) and (not logged)
        meal_status.append({
            "meal_type": meal,
            "due_hour": due_hour,
            "logged": logged,
            "missed": missed,
            "entry": by_meal[meal],
        })
    
    return {
        "logs": logs,
        "summary": {"kcal": round(total_kcal, 1), "protein": round(total_protein, 1)},
        "meal_status": meal_status,
    }
