from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, health, nutrition, emergency, ai_chat
import uvicorn

app = FastAPI(title="SAHARA API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(health.router)
app.include_router(nutrition.router)
app.include_router(emergency.router)
app.include_router(ai_chat.router)

@app.get("/")
async def root():
    return {"message": "SAHARA Backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8080, reload=True)
