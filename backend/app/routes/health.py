from fastapi import APIRouter, HTTPException, status, Depends
from app.models import HealthLogCreate
from app.database import health_logs_collection, users_collection
from datetime import datetime
from typing import List
import random
from bson import ObjectId
from app.utils.anaemia import calculate_anaemia_risk

router = APIRouter(prefix="/api/health", tags=["health"])

def calculate_health_score(log: HealthLogCreate) -> int:
    score = 100
    
    # BP Penalties
    if log.bp_sys > 140 or log.bp_sys < 95: score -= 12
    if log.bp_dia > 90 or log.bp_dia < 60: score -= 8
    
    # Sugar Penalties (Random/Post-meal)
    if log.sugar > 140 or log.sugar < 70: score -= 15
    
    # Heart Rate
    if log.heart_rate > 105 or log.heart_rate < 55: score -= 10

    # Haemoglobin (if available)
    if log.haemoglobin is not None and (log.haemoglobin < 11.0 or log.haemoglobin > 17.0):
        score -= 12
    
    # Fatigue
    if log.fatigue and log.fatigue > 7: score -= 10
    
    return max(15, min(100, score))

import numpy as np

def detect_anomaly(historical_values: List[float], new_value: float, param: str) -> dict:
    if len(historical_values) < 3:
        return {"anomaly": False}

    mean = float(np.mean(historical_values))
    std = float(np.std(historical_values))
    if std == 0:
        return {"anomaly": False}

    z_score = float(abs(new_value - mean) / std)
    direction = "high" if new_value > mean else "low"
    is_anomaly = bool(z_score > 2.0)

    return {
        "anomaly": is_anomaly,
        "z_score": float(round(z_score, 2)),
        "direction": direction,
        "param": param,
        "message": f"{param} is unusually {direction} today compared to your recent readings"
    }

@router.post("/log")
async def log_health(log: HealthLogCreate):
    try:
        # Fetch history for anomaly detection
        cursor = health_logs_collection.find({"user_id": log.user_id}).sort("timestamp", -1).limit(7)
        history = await cursor.to_list(length=7)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database unavailable or authentication failed: {str(e)}"
        )
    
    anomalies = []
    if history:
        # Check Sys BP Anomaly
        sys_vals = [h["bp_sys"] for h in history]
        sys_anon = detect_anomaly(sys_vals, log.bp_sys, "Systolic BP")
        if sys_anon["anomaly"]: anomalies.append(sys_anon)
        
        # Check Sugar Anomaly
        sugar_vals = [h["sugar"] for h in history]
        sugar_anon = detect_anomaly(sugar_vals, log.sugar, "Blood Sugar")
        if sugar_anon["anomaly"]: anomalies.append(sugar_anon)

        # Check Heart Rate Anomaly
        hr_vals = [h.get("heart_rate") for h in history if h.get("heart_rate") is not None]
        if len(hr_vals) >= 3:
            hr_anon = detect_anomaly(hr_vals, log.heart_rate, "Heart Rate")
            if hr_anon["anomaly"]: anomalies.append(hr_anon)

        # Check Haemoglobin Anomaly
        if log.haemoglobin is not None:
            hb_vals = [h.get("haemoglobin") for h in history if h.get("haemoglobin") is not None]
            if len(hb_vals) >= 3:
                hb_anon = detect_anomaly(hb_vals, float(log.haemoglobin), "Haemoglobin")
                if hb_anon["anomaly"]: anomalies.append(hb_anon)

    score = calculate_health_score(log)
    
    # Penalize score if anomalies detected
    if anomalies:
        score = max(15, score - (len(anomalies) * 10))

    log_dict = log.dict()
    log_dict["score"] = score
    log_dict["timestamp"] = datetime.utcnow()
    log_dict["anomalies"] = anomalies

    user = None
    anaemia_risk = None
    try:
        user = await users_collection.find_one({"_id": log.user_id})
        if not user and ObjectId.is_valid(log.user_id):
            user = await users_collection.find_one({"_id": ObjectId(log.user_id)})
    except Exception as e:
        # Keep health logging resilient even if profile lookup fails.
        print(f"⚠ User lookup failed during health log: {e}")

    if user and log.haemoglobin is not None:
        try:
            gender = user.get("gender", "male")
            age = user.get("age", 65)
            risk_data = await calculate_anaemia_risk(float(log.haemoglobin), gender, age, log.fatigue or 0, history)
            anaemia_risk = risk_data.get("risk_level", "LOW")
            log_dict["anaemia_risk"] = anaemia_risk
        except Exception as e:
            # Do not block vitals write if AI risk computation fails.
            print(f"⚠ Anaemia risk calculation failed: {e}")
    
    try:
        result = await health_logs_collection.insert_one(log_dict)
        
        # Update user's latest score
        user_filter = {"_id": log.user_id}
        if ObjectId.is_valid(log.user_id):
            user_filter = {"_id": ObjectId(log.user_id)}
        await users_collection.update_one(
            user_filter,
            {"$set": {
                "latest_score": score, 
                "last_sync": datetime.utcnow(),
                "latest_anomalies": anomalies if anomalies else []
            }}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database write failed: {str(e)}"
        )
    
    return {
        "status": "success", 
        "id": str(result.inserted_id), 
        "score": score,
        "anomalies": anomalies
    }

@router.get("/history/{user_id}")
async def get_history(user_id: str, limit: int = 10):
    try:
        cursor = health_logs_collection.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
        logs = await cursor.to_list(length=limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database read failed: {str(e)}"
        )
    for log in logs:
        log["_id"] = str(log["_id"])
    return logs


@router.post("/auto-log/{user_id}")
async def auto_log_health(user_id: str):
    """Simulate device auto-fetch: generate realistic vitals and persist in MongoDB."""
    log = HealthLogCreate(
        user_id=user_id,
        bp_sys=random.randint(118, 148),
        bp_dia=random.randint(72, 94),
        sugar=random.randint(92, 162),
        heart_rate=random.randint(62, 102),
        haemoglobin=round(random.uniform(10.2, 13.8), 1),
        fatigue=random.randint(1, 8),
    )
    return await log_health(log)
