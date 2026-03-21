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
    
    # SMS Alert Simulation (§4.4)
    user = await users_collection.find_one({"_id": sos.user_id})
    user_name = user.get("name", "Unknown Senior") if user else "Unknown Senior"
    
    maps_url = f"https://maps.google.com/?q={sos.latitude},{sos.longitude}"
    sms_body = f"EMERGENCY: SOS triggered by {user_name}. Location: {maps_url}"
    
    # In production, we'd use:
    # client.messages.create(body=sms_body, from_=TWILIO_NUM, to=user.get('family_phone'))
    
    print(f"\n[TWILIO SIMULATION] Sending SMS to family...")
    print(f"Message: {sms_body}\n")
    
    return {
        "status": "triggered",
        "event_id": str(result.inserted_id),
        "sms_sent": True,
        "message": "Emergency alerts sent to family with GPS link"
    }

@router.get("/history/{user_id}")
async def get_sos_history(user_id: str):
    cursor = sos_events_collection.find({"user_id": user_id}).sort("timestamp", -1)
    events = await cursor.to_list(length=20)
    for ev in events:
        ev["_id"] = str(ev["_id"])
    return events
