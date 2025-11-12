from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from contextlib import asynccontextmanager
from backend.elastic import connect_elasticsearch, close_elasticsearch
import uvicorn

from backend.auth import router as auth_router
from backend.movies import router as movies_router
from backend.users import router as users_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    await connect_elasticsearch()

    yield

    await close_elasticsearch()


# --- FASTAPI APP INITIALIZATION ---

app = FastAPI(
    title="Fast API Movies App",
    docs_url="/movies-docs",
    version="0.0.1",
    lifespan=lifespan,
)  # FIX: lifespan is now correctly passed

origins = [
    "http://localhost:3000",
]

# CORS Middleware (kept external to lifespan for simplicity)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- EXCEPTION HANDLER ---
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _request: Request, exc: RequestValidationError
):  # FIX: Added type hint for _request, included content in return
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


# --- ROUTERS ---
app.include_router(auth_router.router)
app.include_router(movies_router.router)
app.include_router(movies_router.playlist_router)
app.include_router(users_router.router)


@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI Movies App!"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
