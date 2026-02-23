from fastapi import FastAPI
from models import Event
from anomaly import process_event
from store import get_incidents

app = FastAPI()

@app.post("/events")
def receive_event(event: Event):
    return process_event(event)

@app.get("/incidents")
def incidents():
    return get_incidents()
    