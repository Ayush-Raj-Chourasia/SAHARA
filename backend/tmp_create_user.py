import httpx
import sys

data = {
    "name": "Ratan Ji",
    "email": "ratan@example.com",
    "phone": "9876543210",
    "password": "password123",
    "age": 72,
    "gender": "male",
    "weight_kg": 68.0,
    "role": "senior",
    "conditions": ["hypertension", "diabetes"]
}

try:
    response = httpx.post("http://127.0.0.1:8001/api/auth/register", json=data, timeout=30.0)
    if response.status_code == 200:
        print("Success:", response.json())
    else:
        print("Failed:", response.text)
except Exception as e:
    print("Error:", e)
