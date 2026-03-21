from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routes import auth, health, nutrition, emergency, ai_chat
from app.database import client as db_client
import uvicorn
import traceback

app = FastAPI(title="SAHARA API", version="1.0.0")

# Enable CORS - must be added before routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Global error handler for debugging
@app.middleware("http")
async def error_handler_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        print(f"[ERROR] {request.method} {request.url.path}")
        print(f"[ERROR] {str(e)}")
        print(f"[ERROR] {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Error: {str(e)}", "type": type(e).__name__}
        )

# Include Routers (added after CORS middleware)
app.include_router(auth.router)
app.include_router(health.router)
app.include_router(nutrition.router)
app.include_router(emergency.router)
app.include_router(ai_chat.router)

@app.on_event("startup")
async def startup_event():
    """Verify database connection on startup"""
    try:
        # Test connection with a simple server info call
        await db_client.admin.command('ping')
        print("✓ Database connection verified")
    except Exception as e:
        print(f"⚠ Database connection warning: {e}")
        print("App will continue, but database operations may fail")

@app.get("/")
async def root():
    return {"message": "SAHARA Backend is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint for Railway"""
    return {"status": "ok", "service": "SAHARA API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8080, reload=True)
