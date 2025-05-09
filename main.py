from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
import time
import uvicorn

from backend.auth import router as auth_router
from backend.movies import router as movies_router
from backend.users import router as users_router

app = FastAPI(title="Fast API Movies App",
    docs_url="/movies-docs",
    version="0.0.1")

origins = ["http://localhost:3000",]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )

app.include_router(auth_router.router)
app.include_router(movies_router.router)
app.include_router(movies_router.playlist_router)
app.include_router(users_router.router)

@app.get("/")  # Corrected line: added parentheses
async def root():
    return {"message": "Welcome to the FastAPI Movies App!"}


# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request: Request, exc: RequestValidationError):
#     errors = exc.errors()
#     custom_errors = {}
#     print(errors)
#     for error in errors:
#         field = error['loc'][1]
#         msg = error['msg']
#         custom_errors[field] = msg
#     return JSONResponse(
#         status_code=422,
#         content={"message": custom_errors},
#     )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
 
