from fastapi import APIRouter, HTTPException, status, Depends
from app.models import HealthLogCreate
from app.database import health_logs_collection, users_collection
from datetime import datetime
from typing import List

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
    
    # Fatigue
    if log.fatigue and log.fatigue > 7: score -= 10
    
    return max(15, min(100, score))

import numpy as np

def detect_anomaly(historical_values: List[float], new_value: float, param: str) -> dict:
    if len(historical_values) < 3:
        return {"anomaly": False}

    mean = np.mean(historical_values)
    std = np.std(historical_values)
    if std == 0:
        return {"anomaly": False}

    z_score = abs(new_value - mean) / std
    direction = "high" if new_value > mean else "low"

    return {
        "anomaly": z_score > 2.0,
        "z_score": round(z_score, 2),
        "direction": direction,
        "param": param,
        "message": f"{param} is unusually {direction} today compared to your recent readings"
    }

@router.post("/log")
async def log_health(log: HealthLogCreate):
    # Fetch history for anomaly detection
    cursor = health_logs_collection.find({"user_id": log.user_id}).sort("timestamp", -1).limit(7)
    history = await cursor.to_list(length=7)
    
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

    score = calculate_health_score(log)
    
    # Penalize score if anomalies detected
    if anomalies:
        score = max(15, score - (len(anomalies) * 10))

    log_dict = log.dict()
    log_dict["score"] = score
    log_dict["timestamp"] = datetime.utcnow()
    log_dict["anomalies"] = anomalies
    
    result = await health_logs_collection.insert_one(log_dict)
    
    # Update user's latest score
    await users_collection.update_one(
        {"_id": log.user_id},
        {"$set": {
            "latest_score": score, 
            "last_sync": datetime.utcnow(),
            "latest_anomalies": anomalies if anomalies else []
        }}
    )
    
    return {
        "status": "success", 
        "id": str(result.inserted_id), 
        "score": score,
        "anomalies": anomalies
    }

@router.get("/history/{user_id}")
async def get_history(user_id: str, limit: int = 10):
    cursor = health_logs_collection.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
    logs = await cursor.to_list(length=limit)
    for log in logs:
        log["_id"] = str(log["_id"])
    return logs
