from app.main import app
import uvicorn
import os

from routes.health    import router as health_router
from routes.nutrition import router as nutrition_router
from routes.ai_chat   import router as chat_router

app.include_router(health_router,    prefix="/api/health")
app.include_router(nutrition_router, prefix="/api/nutrition")
app.include_router(chat_router,      prefix="/api/ai")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
