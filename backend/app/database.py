import os
import motor.motor_asyncio
from dotenv import load_dotenv

load_dotenv(override=True)

load_dotenv(override=True)
MONGO_URL = os.getenv("MONGO_URI", "mongodb://localhost:27017/sahara")
print("DATABSE USING MONGO_URL:", MONGO_URL)
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client.get_default_database()

# Collections
users_collection = db.get_collection("users")
health_logs_collection = db.get_collection("health_logs")
nutrition_logs_collection = db.get_collection("nutrition_logs")
sos_events_collection = db.get_collection("sos_events")
