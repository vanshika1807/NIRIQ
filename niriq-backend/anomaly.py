from store import add_incident
import uuid

BASELINE = {
    "payment_failure_rate": 5
}

def process_event(event):
    if event.type == "metric":
        baseline = BASELINE.get(event.name, 0)
        if event.value and event.value > baseline * 2:
            incident = {
                "id": f"INC-{uuid.uuid4().hex[:6]}",
                "title": f"{event.name} anomaly detected",
                "severity": "HIGH",
                "service": event.source,
                "cause": "Abnormal spike detected",
                "confidence": 0.9
            }
            add_incident(incident)
            return {"anomaly": True, "incident": incident}

    return {"anomaly": False}