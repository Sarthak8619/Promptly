# main.py

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from rag.enhancer import generate_enhanced_prompt

app = FastAPI()

# Allow frontend (Chrome Extension) to call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev only. Lock this down later.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the input schema
class PromptInput(BaseModel):
    raw_prompt: str

@app.post("/enhance")
def enhance_prompt(payload: PromptInput):
    enhanced = generate_enhanced_prompt(payload.raw_prompt)
    return {"enhanced_prompt": enhanced}
