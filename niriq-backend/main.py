from fastapi import FastAPI
from models import Event
from anomaly import process_event
from store import get_incidents
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "NIRIQ backend running"}

@app.post("/events")
def receive_event(event: Event):
    return process_event(event)

@app.get("/incidents", include_in_schema=True)
@app.get("/incidents/")
def incidents():
    return get_incidents()

