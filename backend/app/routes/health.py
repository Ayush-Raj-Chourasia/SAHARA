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

@router.post("/log")
async def log_health(log: HealthLogCreate):
    score = calculate_health_score(log)
    
    log_dict = log.dict()
    log_dict["score"] = score
    log_dict["timestamp"] = datetime.utcnow()
    
    result = await health_logs_collection.insert_one(log_dict)
    
    # Update user's latest score
    await users_collection.update_one(
        {"_id": log.user_id},
        {"$set": {"latest_score": score, "last_sync": datetime.utcnow()}}
    )
    
    return {"status": "success", "id": str(result.inserted_id), "score": score}

@router.get("/history/{user_id}")
async def get_history(user_id: str, limit: int = 10):
    cursor = health_logs_collection.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
    logs = await cursor.to_list(length=limit)
    for log in logs:
        log["_id"] = str(log["_id"])
    return logs
