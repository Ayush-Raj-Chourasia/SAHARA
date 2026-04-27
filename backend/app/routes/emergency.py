import os
from fastapi import APIRouter, HTTPException
from app.models import SOSCreate
from app.database import sos_events_collection, users_collection
from datetime import datetime

router = APIRouter(prefix="/api/emergency", tags=["emergency"])

from twilio.rest import Client

# Twilio Config
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_num = os.getenv("TWILIO_WHATSAPP_NUMBER") # Using WhatsApp as per user request

client = None
if account_sid and auth_token:
    client = Client(account_sid, auth_token)

@router.post("/sos")
async def trigger_sos(sos: SOSCreate):
    """Trigger SOS emergency alert with real-time Twilio SMS"""
    try:
        # 1. Log SOS event to database
        sos_dict = sos.dict()
        sos_dict["timestamp"] = datetime.utcnow()
        sos_dict["status"] = "triggered"
        sos_dict["sms_sent"] = False
        sos_dict["whatsapp_sent"] = False
        
        result = await sos_events_collection.insert_one(sos_dict)
        sos_event_id = str(result.inserted_id)
        
        # 2. Fetch user info
        user = await users_collection.find_one({"_id": sos.user_id})
        if not user:
            return {
                "status": "triggered",
                "event_id": sos_event_id,
                "alert_sent": False,
                "message": "SOS logged but user not found"
            }
        
        user_name = user.get("name", "Unknown Senior")
        user_phone = user.get("phone")
        
        # 3. Create emergency message with Google Maps link
        maps_url = f"https://maps.google.com/?q={sos.latitude},{sos.longitude}"
        message_body = f"🚨 EMERGENCY SOS from {user_name}\n📍 Location: {maps_url}\n⏰ {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} IST"
        
        # 4. Initialize response flags
        sms_sent = False
        whatsapp_sent = False
        alert_message = "SOS triggered - Emergency alerts being sent"
        
        # 5. Send via Twilio (SMS + WhatsApp)
        if client and account_sid and auth_token:
            try:
                # Try WhatsApp first (via Twilio Sandbox or Business Account)
                if twilio_num:
                    try:
                        msg = client.messages.create(
                            from_=f"whatsapp:{twilio_num}",
                            body=message_body,
                            to=f"whatsapp:{user_phone}" if user_phone else f"whatsapp:+919142928046"
                        )
                        whatsapp_sent = True
                        print(f"WhatsApp SOS sent: {msg.sid}")
                    except Exception as wa_error:
                        print(f"WhatsApp failed, trying SMS: {wa_error}")
                        # Fallback to SMS
                        try:
                            phone_for_sms = user_phone if user_phone and user_phone.startswith("+") else f"+91{user_phone.lstrip('0')}" if user_phone else "+919142928046"
                            msg = client.messages.create(
                                from_=twilio_num,
                                body=message_body,
                                to=phone_for_sms
                            )
                            sms_sent = True
                            print(f"SMS SOS sent: {msg.sid}")
                        except Exception as sms_error:
                            print(f"SMS also failed: {sms_error}")
                
            except Exception as e:
                print(f"Twilio Error (critical alert still logged): {e}")
        else:
            alert_message = "SOS triggered - Twilio not configured (emergency logged to DB)"
            print("Twilio not configured - SOS logged to database only")
        
        # 6. Update SOS event with sent status
        await sos_events_collection.update_one(
            {"_id": result.inserted_id},
            {"$set": {
                "sms_sent": sms_sent,
                "whatsapp_sent": whatsapp_sent,
                "alert_sent_timestamp": datetime.utcnow() if (sms_sent or whatsapp_sent) else None
            }}
        )
        
        return {
            "status": "triggered",
            "event_id": sos_event_id,
            "alert_sent": sms_sent or whatsapp_sent,
            "whatsapp_sent": whatsapp_sent,
            "sms_sent": sms_sent,
            "user_name": user_name,
            "location": {"latitude": sos.latitude, "longitude": sos.longitude},
            "maps_url": maps_url,
            "message": alert_message
        }
        
    except Exception as e:
        print(f"SOS Trigger Error: {e}")
        return {
            "status": "error",
            "message": str(e),
            "alert_sent": False
        }

@router.get("/history/{user_id}")
async def get_sos_history(user_id: str):
    cursor = sos_events_collection.find({"user_id": user_id}).sort("timestamp", -1)
    events = await cursor.to_list(length=20)
    for ev in events:
        ev["_id"] = str(ev["_id"])
    return events
