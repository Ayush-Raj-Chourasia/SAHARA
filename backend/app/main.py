import os
import traceback
from fastapi import FastAPI
from fastapi import Request
from fastapi import HTTPException
from fastapi import Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routes import auth, health, nutrition, emergency, ai_chat
from app.database import client as db_client
import uvicorn

app = FastAPI(title="SAHARA API", version="1.0.0")

raw_origins = os.getenv(
    "CORS_ORIGINS",
    "https://sahara-flax.vercel.app,https://frontend-nine-mu-mtbg6zpr7c.vercel.app,http://localhost:5173,http://localhost:3000",
)
allowed_origins = [origin.strip().rstrip("/") for origin in raw_origins.split(",") if origin.strip()]
allowed_origin_regex = os.getenv(
    "CORS_ORIGIN_REGEX",
    r"https://.*\.vercel\.app|http://localhost(:\d+)?",
)

# Enable CORS - must be added before routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)


@app.middleware("http")
async def add_cors_fallback_headers(request: Request, call_next):
    origin = (request.headers.get("origin") or "").rstrip("/")
    response = await call_next(request)
    if origin and origin in allowed_origins:
        response.headers.setdefault("Access-Control-Allow-Origin", origin)
        response.headers.setdefault("Access-Control-Allow-Credentials", "true")
        response.headers.setdefault("Vary", "Origin")
    return response


@app.options("/{full_path:path}")
async def cors_preflight_handler(full_path: str, request: Request):
    origin = (request.headers.get("origin") or "").rstrip("/")
    requested_headers = request.headers.get("access-control-request-headers", "Authorization,Content-Type")
    response = Response(status_code=204)
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Vary"] = "Origin"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = requested_headers
    response.headers["Access-Control-Max-Age"] = "3600"
    return response

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    print(f"[HTTP_ERROR] {request.method} {request.url.path} -> {exc.status_code}: {exc.detail}")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    print(f"[ERROR] {request.method} {request.url.path}")
    print(f"[ERROR] {str(exc)}")
    print(f"[ERROR] {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__},
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
