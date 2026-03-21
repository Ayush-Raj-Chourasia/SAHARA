import os
import joblib
import pandas as pd
import numpy as np
import json
import re
from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Configure Gemini
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

# Load models globally
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

try:
    food_data = joblib.load(os.path.join(MODELS_DIR, "food_data.pkl"))
    food_knn = joblib.load(os.path.join(MODELS_DIR, "food_knn.pkl"))
    scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))
except Exception as e:
    print(f"Error loading nutrition models: {e}")
    food_data = pd.DataFrame()
    food_knn = None
    scaler = None

class NutritionSimilarRequest(BaseModel):
    calories: float
    carbs: float
    protein: float
    fat: float
    sugar: float
    fiber: float
    sodium: float
    calcium_mg: float
    iron_mg: float
    vitamin_c_mg: float

class NutritionAnalyzeRequest(BaseModel):
    meal_text: str
    user_name: str
    age: int
    gender: str
    weight_kg: float

@router.get("/search")
async def search_food(query: str):
    if food_data.empty:
        return {"results": [], "message": "Food database not loaded."}
        
    # Search: case-insensitive
    matches = food_data[food_data['food_name'].str.contains(query, case=False, na=False)]
    if matches.empty:
        return {"results": [], "message": f"No foods found matching '{query}'"}
        
    # Get top 10 matches
    top_10 = matches.head(10)
    
    # Round float values to 2 decimal places
    results = []
    for _, row in top_10.iterrows():
        item = {}
        for col in top_10.columns:
            val = row[col]
            if isinstance(val, float):
                item[col] = round(val, 2)
            else:
                item[col] = val
        results.append(item)
        
    return {"results": results}

@router.post("/similar")
async def similar_foods(request: NutritionSimilarRequest):
    if food_knn is None or scaler is None or food_data.empty:
        return {"results": [], "error": "Models not loaded."}
        
    input_vec = np.array([[
        request.calories, request.carbs, request.protein, request.fat,
        request.sugar, request.fiber, request.sodium, request.calcium_mg,
        request.iron_mg, request.vitamin_c_mg
    ]])
    
    scaled = scaler.transform(input_vec)
    distances, indices = food_knn.kneighbors(scaled, n_neighbors=5)
    
    results = []
    for rank, idx in enumerate(indices[0], start=1):
        row = food_data.iloc[idx]
        item = {}
        for col in food_data.columns:
            val = row[col]
            if isinstance(val, float):
                item[col] = round(val, 2)
            else:
                item[col] = val
        item["similarity_rank"] = rank
        results.append(item)
        
    return {"results": results}

@router.post("/analyze")
async def analyze_meal(request: NutritionAnalyzeRequest):
    if not GENAI_API_KEY:
        return {
            "error": "Gemini unavailable",
            "tip": "Describe meal in English and retry (API key not set)"
        }
        
    prompt = (
        f"You are a clinical nutritionist for elderly Indians aged 60-85.\n"
        f"Patient: {request.user_name}, age {request.age}, gender {request.gender}, weight {request.weight_kg}kg.\n"
        f"Analyze this meal. Return ONLY valid JSON, no markdown, no extra text:\n"
        f"{{\n"
        f"  'food_name': 'English name',\n"
        f"  'calories': 450, 'carbs': 68, 'protein': 14, 'fat': 8,\n"
        f"  'sugar': 3, 'fiber': 5, 'sodium': 200,\n"
        f"  'calcium_mg': 40, 'iron_mg': 4.0, 'vitamin_c_mg': 5, 'folate_µg': 20,\n"
        f"  'suggestion_hindi': 'short tip in Hindi',\n"
        f"  'suggestion_english': 'short tip in English'\n"
        f"}}\n"
        f"Meal: {request.meal_text}"
    )
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Strip markdown fences
        text = re.sub(r"^```[a-zA-Z]*\n?", "", text)
        text = re.sub(r"\n?```$", "", text)
        text = text.strip()
        
        # Try to parse
        # Convert single quotes to double quotes if the model incorrectly adhered exactly to the prompt's single quotes
        if not text.startswith("{"):
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1:
                text = text[start:end+1]
                
        # Handle simple single quote JSON just in case
        try:
            parsed_json = json.loads(text)
        except json.JSONDecodeError:
            # simple single to double quote fix
            fixed_text = text.replace("'", '"')
            parsed_json = json.loads(fixed_text)
            
        # Get similar foods based on JSON
        similar_items = []
        if food_knn and scaler and not food_data.empty:
            input_vec = np.array([[
                float(parsed_json.get("calories", 0)),
                float(parsed_json.get("carbs", 0)),
                float(parsed_json.get("protein", 0)),
                float(parsed_json.get("fat", 0)),
                float(parsed_json.get("sugar", 0)),
                float(parsed_json.get("fiber", 0)),
                float(parsed_json.get("sodium", 0)),
                float(parsed_json.get("calcium_mg", 0)),
                float(parsed_json.get("iron_mg", 0)),
                float(parsed_json.get("vitamin_c_mg", 0))
            ]])
            
            scaled = scaler.transform(input_vec)
            distances, indices = food_knn.kneighbors(scaled, n_neighbors=5)
            
            for rank, idx in enumerate(indices[0], start=1):
                row = food_data.iloc[idx]
                sim_item = {
                    "food_name": str(row.get("food_name", "Unknown")),
                    "calories": round(float(row.get("calories", 0)), 2),
                    "protein": round(float(row.get("protein", 0)), 2),
                    "similarity_rank": rank
                }
                similar_items.append(sim_item)
                
        # Build final response
        return {
            "meal_text": request.meal_text,
            "nutrition": {
                "calories": parsed_json.get("calories"),
                "carbs": parsed_json.get("carbs"),
                "protein": parsed_json.get("protein"),
                "fat": parsed_json.get("fat"),
                "sugar": parsed_json.get("sugar"),
                "fiber": parsed_json.get("fiber"),
                "sodium": parsed_json.get("sodium"),
                "calcium_mg": parsed_json.get("calcium_mg"),
                "iron_mg": parsed_json.get("iron_mg"),
                "vitamin_c_mg": parsed_json.get("vitamin_c_mg"),
                "folate_µg": parsed_json.get("folate_µg")
            },
            "similar_foods": similar_items,
            "suggestion_hindi": parsed_json.get("suggestion_hindi", ""),
            "suggestion_english": parsed_json.get("suggestion_english", "")
        }
    except Exception as e:
        return {
            "error": "Gemini unavailable",
            "tip": "Describe meal in English and retry",
            "details": str(e)
        }
