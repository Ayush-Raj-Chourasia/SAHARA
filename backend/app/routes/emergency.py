from fastapi import APIRouter, HTTPException
from app.models import SOSCreate
from app.database import sos_events_collection, users_collection
from datetime import datetime

router = APIRouter(prefix="/api/emergency", tags=["emergency"])

@router.post("/sos")
async def trigger_sos(sos: SOSCreate):
    # Log SOS event
    sos_dict = sos.dict()
    sos_dict["timestamp"] = datetime.utcnow()
    result = await sos_events_collection.insert_one(sos_dict)
    
    # Mock SMS alert (Twilio integration would go here)
    user = await users_collection.find_one({"_id": sos.user_id})
    user_name = user.get("name", "Unknown Senior") if user else "Unknown Senior"
    
    print(f"!!! SOS ALERT !!! Senior: {user_name} | Location: {sos.latitude}, {sos.longitude}")
    # In real implementation: client.messages.create(...)
    
    return {
        "status": "triggered",
        "event_id": str(result.inserted_id),
        "message": "Emergency alerts sent to family"
    }

@router.get("/history/{user_id}")
async def get_sos_history(user_id: str):
    cursor = sos_events_collection.find({"user_id": user_id}).sort("timestamp", -1)
    events = await cursor.to_list(length=20)
    for ev in events:
        ev["_id"] = str(ev["_id"])
    return events
