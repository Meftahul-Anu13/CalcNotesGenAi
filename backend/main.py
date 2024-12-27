import uvicorn
import os
from fastapi import FastAPI,HTTPException
import requests
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.route import router as router
import json
import ast 
import uvicorn
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

SERVER_URL = '127.0.0.1'  # or 'localhost'
PORT = 8000  #
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Server is running"}

app.include_router(router, prefix="/api", tags=["api"])
if __name__ == "__main__":
    uvicorn.run("main:app", host=SERVER_URL, port=PORT, reload=True)