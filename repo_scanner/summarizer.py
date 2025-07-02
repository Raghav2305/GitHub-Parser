# repo_scanner/summarizer.py

import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

def generate_summary_with_gemini(categorized_files: dict) -> str:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

    prompt = f"""
    You are an expert software engineer. Given the following categorized file list of a GitHub repository, provide:
    1. A one-paragraph overview of what the repo is likely doing.
    2. A short explanation of each category's role.
    3. A suggested main file or entry point, if any.

    Categorized Files:
    {categorized_files}
    """

    model = genai.GenerativeModel("gemini-2.0-flash-lite")
    response = model.generate_content(prompt)

    return response.text
