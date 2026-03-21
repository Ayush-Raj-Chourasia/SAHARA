import os
import json
import base64
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

class NutritionRequest(BaseModel):
    prompt: str
    image: str = None  # Base64 data URL

@app.post("/api/ai/nutrition")
async def get_nutrition(req: NutritionRequest):
    if not api_key:
        # Mock response for demo if API key is missing
        return {"results": [{"name": "Sample Item", "kcal": 100, "protein": 5}]}

    try:
        content = [req.prompt]
        if req.image:
            # Extract base64 data
            if "," in req.image:
                header, data = req.image.split(",", 1)
            else:
                data = req.image
            
            image_data = base64.b64decode(data)
            content.append({
                "mime_type": "image/jpeg",  # Assume jpeg, can be improved
                "data": image_data
            })

        response = model.generate_content(content)
        text = response.text
        
        # Extract JSON from response text
        start = text.find('[')
        end = text.lastIndexOf(']') + 1
        if start != -1 and end > 0:
            json_str = text[start:end]
            results = json.loads(json_str)
            return {"results": results}
        else:
            # Try to parse as single object if array not found
            start = text.find('{')
            end = text.lastIndexOf('}') + 1
            if start != -1 and end > 0:
                json_str = text[start:end]
                results = json.loads(json_str)
                return {"results": [results] if isinstance(results, dict) else results}
            
        raise HTTPException(status_code=500, detail="Could not parse AI response as JSON")

    except Exception as e:
        print(f"AI Error: {e}")
        return {"results": [{"name": "Error processing", "kcal": 0, "protein": 0}]}

@app.get("/health")
async def health_check():
    return {"status": "ok", "api_key_configured": bool(api_key)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
