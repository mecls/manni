import ollama
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
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
    Summarize the following code snippet in two sentences.
    code snippet:{code}
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

        return {"summary": answer}
    except Exception as e:
        return {"error": str(e)}
    
    