from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
REDIRECT_URI = os.getenv("AUTH0_REDIRECT_URI")

@app.get("/")
def home():
    return {"message": "Welcome to Niriq 🚀"}

@app.get("/auth/login")
def login():
    auth_url = (
        f"https://{AUTH0_DOMAIN}/authorize?"
        f"response_type=code&"
        f"client_id={CLIENT_ID}&"
        f"redirect_uri={REDIRECT_URI}&"
        f"scope=openid profile email"
    )
    return RedirectResponse(auth_url)

@app.get("/auth/callback")
def callback():
    return {"message": "Login successful ✅"}

@app.get("/agent/request")
def agent_request():
    return {
        "agent": "I want to access logs. Do you approve?",
        "action": "read_logs"
    }

approved_actions = []

@app.get("/agent/approve")
def approve(action: str):
    approved_actions.append(action)
    return {
        "message": f"Action '{action}' approved ✅"
    }

@app.get("/agent/action")
def perform_action(action: str):
    if action not in approved_actions:
        return {
            "error": "Permission denied ❌"
        }

    return {
        "message": f"Action '{action}' executed successfully 🚀"
    }