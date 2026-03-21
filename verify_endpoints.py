import requests
import json

def verify():
    url = "http://localhost:8000/api/health/log"
    payload = {
        "user_id": "audit_test_final_ok",
        "bp_sys": 195,
        "bp_dia": 115,
        "sugar": 280,
        "heart_rate": 95,
        "fatigue": 9
    }
    print(f"Sending POST to {url}...")
    try:
        r = requests.post(url, json=payload, timeout=10)
        print(f"Status: {r.status_code}")
        print(f"Response: {json.dumps(r.json(), indent=2)}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    verify()
