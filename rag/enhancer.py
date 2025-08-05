import os
from dotenv import load_dotenv
import google.generativeai as genai
from rag.retriever import retrieve_relevant_chunks

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use Gemini 1.5 Flash (or change to 1.5 Pro if needed)
model = genai.GenerativeModel("gemini-1.5-flash")


def build_prompt_template(raw_prompt, context_chunks):
    context = "\n\n".join(context_chunks)
    return f"""
You are a world-class prompt engineer. Based on the context below, rewrite the user’s prompt into a clearer, more structured, and effective one that will get better results from an LLM.

## Context (from expert prompt guides):
{context}

## User Prompt:
{raw_prompt}

## Enhanced Prompt:
"""


def generate_enhanced_prompt(raw_prompt: str, top_k: int = 5):
    relevant_chunks = retrieve_relevant_chunks(raw_prompt, top_k)
    prompt = build_prompt_template(raw_prompt, relevant_chunks)
    response = model.generate_content(prompt)
    return response.text.strip()


if __name__ == "__main__":
    test_prompt = "generate a prompt to write a haiku about AI"
    enhanced = generate_enhanced_prompt(test_prompt)
    print("\n🔮 Enhanced Prompt:\n", enhanced)
