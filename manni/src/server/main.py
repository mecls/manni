import ollama
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_json(text):
    """Extracts JSON from LLM response text."""
    # Try to find JSON content using regex pattern
    json_pattern = r'```json\s*([\s\S]*?)\s*```|```\s*([\s\S]*?)\s*```|(\{[\s\S]*\})'
    match = re.search(json_pattern, text)
    
    if match:
        # Get the first non-None group that was matched
        json_str = next(group for group in match.groups() if group is not None)
        
        try:
            # Clean up and parse the JSON
            json_str = json_str.strip()
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {str(e)}")
            return {"error": "Failed to parse JSON from response"}
    
    # If no JSON pattern is found, try to find any content between curly braces
    try:
        # Find the outermost pair of curly braces
        brace_pattern = r'\{[\s\S]*\}'
        brace_match = re.search(brace_pattern, text)
        if brace_match:
            return json.loads(brace_match.group(0))
    except json.JSONDecodeError:
        pass
    
    # If all else fails, return a default structure
    return {
        "Potential Issues": ["Failed to extract structured data from LLM response"],
        "LineWithIssue": {}
    }

@app.get("/summarize")
async def codeSummary(code: str):
    """Receives a code snippet and returns a concise explanation of the code."""
    if not code:
        return {"error": "No code provided in the request."}

    prompt = f"""
    Carefully analyze the code snippet below and identify any potential issues or bugs.
    
    For each issue you find:
    1. Clearly identify the line number where the issue occurs
    2. Provide a brief description of the issue
    
    Format your response in this exact JSON format:
    {{
        "Potential Issues": ["List all issues you found, one per item"],
        "LineWithIssue": {{
            "5": "Description of issue on line 5",
            "10": "Description of issue on line 10"
        }}
    }}
    
    It's important that the line numbers in "LineWithIssue" are numeric strings without any prefix.
    
    Code snippet:
    {code}
    """

    try:
        response = ollama.chat(
            model="codegemma:7b",
            messages=[{'role': 'user', 'content': prompt}]
        )

        raw_answer = response['message']['content']
        print("Raw response from LLM:", raw_answer)  # Add for debugging
        
        # Extract structured data from the raw answer
        structured_response = extract_json(raw_answer)
        print("Structured response:", structured_response)  # Add for debugging
        
        return structured_response
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Add for debugging
        return {"error": str(e)}