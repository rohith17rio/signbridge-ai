import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from utils.logger import logger

from api.health import router as health_router
from api.vision import router as vision_router
from api.dataset import router as dataset_router
from api.ai_router import router as ai_router
from api.speech import router as speech_router
from api.translation import router as translation_router
from api.train import router as train_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-ready backend platform for SIGNSETU AI connecting Deaf, Mute, and Hearing users."
)

# CORS middleware for local frontend dev server & web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router)
app.include_router(vision_router, prefix="/api/vision")
app.include_router(dataset_router, prefix="/api/dataset")
app.include_router(ai_router, prefix="/api/model")
app.include_router(speech_router, prefix="/api/speech")
app.include_router(translation_router, prefix="/api/translation")
app.include_router(train_router, prefix="/api/train")

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} backend server...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"Shutting down {settings.PROJECT_NAME} backend server...")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
