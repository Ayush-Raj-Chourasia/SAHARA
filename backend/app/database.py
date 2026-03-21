import os
import motor.motor_asyncio
from dotenv import load_dotenv

load_dotenv(override=True)

load_dotenv(override=True)

# Support both README naming (MONGO_URI) and existing naming (MONGO_URL).
MONGO_URL = os.getenv("MONGO_URI") or os.getenv("MONGO_URL")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "sahara")

if not MONGO_URL:
    MONGO_URL = "mongodb://localhost:27017/sahara"
    print("Warning: MONGO_URI missing, using fallback.")

print("DATABASE USING MONGO_URL:", MONGO_URL)
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=10000)
db = client[MONGO_DB_NAME]

# Collections
users_collection = db.get_collection("users")
health_logs_collection = db.get_collection("health_logs")
nutrition_logs_collection = db.get_collection("nutrition_logs")
sos_events_collection = db.get_collection("sos_events")
family_links_collection = db.get_collection("family_links")
ai_chat_messages_collection = db.get_collection("ai_chat_messages")
