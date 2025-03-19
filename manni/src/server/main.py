import ollama
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific domains later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/summarize")
async def codeSummary(code: str):
    """Receives a code snippet and returns a concise explanation of the code"""
    if not code:
        return {"error": "No code provided in the request."}
    
    # No need to parse JSON, code is already a string from the query parameter
    prompt = f"""
    You are an assistant who summarizes code. Please strictly follow the format below to explain the given code snippet:

    **Explanation Format:**
    - Explanation: Provide a concise explanation of what the code does in one sentence.
    - Features: List the main features of the code.
    - Purpose: Describe the purpose of the code.
    - Usage: Explain how the code can be used.
    - Limitations: Mention any limitations of the code.
    - Suggestions for improvement: Offer suggestions on how the code can be improved.

    Here is the code snippet:
    {code}
    """

    try:
        response = ollama.chat(
            model="codegemma:7b",
            messages=[{'role': 'user', 'content': prompt}]
        )
        # Check the actual structure of your ollama response
        # This may vary depending on the version
        answer = response['message']['content']  # Adjust as needed
        # # Ensure the response is structured properly
        # summary = {
        #     "Explanation": "",
        #     "Features": "",
        #     "Purpose": "",
        #     "Usage": "",
        #     "Limitations": "",
        #     "Suggestions for improvement": ""
        # }

        # # Process the model response and fill in the fields
        # for line in answer.split("\n"):
        #     if line.lower().startswith("explanation:"):
        #         summary["Explanation"] = line[len("Explanation:"):].strip()
        #     elif line.lower().startswith("features:"):
        #         summary["Features"] = line[len("Features:"):].strip()
        #     elif line.lower().startswith("purpose:"):
        #         summary["Purpose"] = line[len("Purpose:"):].strip()
        #     elif line.lower().startswith("usage:"):
        #         summary["Usage"] = line[len("Usage:"):].strip()
        #     elif line.lower().startswith("limitations:"):
        #         summary["Limitations"] = line[len("Limitations:"):].strip()
        #     elif line.lower().startswith("suggestions for improvement:"):
        #         summary["Suggestions for improvement"] = line[len("Suggestions for improvement:"):].strip()

        return {"summary": answer}
    except Exception as e:
        return {"error": str(e)}