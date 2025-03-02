from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI()

# Allow requests from localhost:3000 (React app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002"],  # React app's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/run-script")
async def run_script():
    try:
        result = subprocess.run(['python3', 'traffic_optimizer.py'], capture_output=True, text=True)
        return {"output": result.stdout}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
