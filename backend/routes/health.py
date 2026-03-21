import os
import joblib
import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.sahara
health_logs_collection = db.health_logs

# Load models globally
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

try:
    health_model = joblib.load(os.path.join(MODELS_DIR, "health_model.pkl"))
    features_list = joblib.load(os.path.join(MODELS_DIR, "features.pkl"))
    anemia_model = joblib.load(os.path.join(MODELS_DIR, "anemia_model.pkl"))
except Exception as e:
    print(f"Error loading models: {e}")
    health_model = None
    features_list = None
    anemia_model = None

class HealthLogRequest(BaseModel):
    bp_sys: float
    bp_dia: float
    blood_sugar: float
    hemoglobin: float
    weight_kg: float = 65
    fatigue_level: float = 2
    age: int = 70
    gender: str = "male"
    sleep_duration: float = 7
    quality_of_sleep: float = 7
    physical_activity_level: float = 40
    stress_level: float = 4
    heart_rate: float = 72
    daily_steps: float = 3000
    MCH: float = 28
    MCHC: float = 33
    MCV: float = 85
    user_id: str = "default"
    # Optional extras for full score
    medication_taken: bool = True
    kcal_today: float = 1800
    protein_today: float = 50

@router.post("/log")
async def log_health(request: HealthLogRequest):
    try:
        # ── Exact health score formula ─────────────────────────────
        score = 100
        bp_sys      = request.bp_sys
        bp_dia      = request.bp_dia
        blood_sugar = request.blood_sugar
        hr          = request.heart_rate
        steps       = request.daily_steps
        sleep_h     = request.sleep_duration
        kcal        = request.kcal_today
        protein     = request.protein_today

        # Vitals  (45% weight)
        if bp_sys > 140 or bp_sys < 95:   score -= 12
        if bp_dia > 90  or bp_dia < 60:   score -= 8
        if blood_sugar > 140 or blood_sugar < 70: score -= 15
        if hr < 55 or hr > 105:           score -= 10

        # Medication (15% weight)
        if not request.medication_taken:  score -= 15

        # Physical activity (20% weight)
        if steps < 4000:                  score -= 10
        elif steps < 6000:                score -= 5
        if sleep_h < 6 or sleep_h > 9:   score -= 7

        # Nutrition (20% weight)
        if kcal < 1400 or kcal > 2200:   score -= 10
        if protein < 45:                  score -= 10

        final    = max(0, min(100, score))
        category = "Good" if final >= 75 else "Fair" if final >= 50 else "Poor"
        color    = "green" if final >= 75 else "amber" if final >= 50 else "red"
        label_map = {"Good": "Good Condition", "Fair": "Monitor Closely", "Poor": "Needs Attention"}

        # Step 2: Anemia model
        gender = request.gender.lower()
        gender_encoded = 1 if gender == "female" else 0
        anemia_features = [[gender_encoded, request.hemoglobin, request.MCH, request.MCHC, request.MCV]]

        
        if anemia_model:
            an_pred = anemia_model.predict(anemia_features)[0]
            anemia_conf = max(anemia_model.predict_proba(anemia_features)[0])
        else:
            an_pred = 0
            anemia_conf = 0.0

        label = "Anemia Detected" if an_pred == 1 else "No Anemia"

        # Step 3: Health model (XGBoost)
        if health_model and features_list:
            input_df = pd.DataFrame([[
                request.sleep_duration, request.quality_of_sleep,
                request.physical_activity_level, request.stress_level,
                request.heart_rate, request.daily_steps,
                bp_sys, bp_dia
            ]], columns=features_list)
            
            health_pred = int(health_model.predict(input_df)[0])
            health_conf = float(max(health_model.predict_proba(input_df)[0]))
        else:
            health_pred = -1
            health_conf = 0.0

        response_data = {
            "health_score": final,
            "category": category,
            "color": color,
            "anemia_prediction": int(an_pred),
            "anemia_label": label,
            "anemia_confidence": round(float(anemia_conf), 2),
            "health_model_prediction": health_pred,
            "health_model_confidence": round(health_conf, 2),
            "timestamp": datetime.utcnow().isoformat()
        }

        # Save to DB
        log_entry = request.dict()
        log_entry.update(response_data)
        await health_logs_collection.insert_one(log_entry)

        # The response must omit timestamp for strict matching, but adding it shouldn't hurt.
        # Removing from response_data to exactly match the requested output
        response_data.pop("timestamp")

        return response_data

    except Exception as e:
        return {
            "health_score": 0,
            "category": "Error",
            "color": "gray",
            "anemia_prediction": 0,
            "anemia_label": "Unknown",
            "anemia_confidence": 0.0,
            "health_model_prediction": -1,
            "health_model_confidence": 0.0,
            "error_msg": str(e)
        }

@router.get("/history/{user_id}")
async def get_health_history(user_id: str, days: int = 30):
    try:
        from datetime import timedelta
        cutoff = datetime.utcnow() - timedelta(days=days)
        cursor = health_logs_collection.find({
            "user_id": user_id,
            "timestamp": {"$gte": cutoff.isoformat()}
        }).sort("timestamp", -1)
        
        logs = await cursor.to_list(length=100)
        for log in logs:
            log["_id"] = str(log["_id"])
            
        return {"logs": logs, "total": len(logs)}
    except Exception as e:
        return {"logs": [], "total": 0, "error": str(e)}

@router.get("/summary/{user_id}")
async def get_health_summary(user_id: str):
    try:
        latest_log = await health_logs_collection.find_one(
            {"user_id": user_id},
            sort=[("timestamp", -1)]
        )
        if latest_log:
            return {
                "latest_score": latest_log.get("health_score", 0),
                "anemia_label": latest_log.get("anemia_label", "No Anemia"),
                "last_logged": latest_log.get("timestamp", "")
            }
        return {"latest_score": 0, "anemia_label": "No Data", "last_logged": None}
    except Exception as e:
        return {"error": str(e)}
