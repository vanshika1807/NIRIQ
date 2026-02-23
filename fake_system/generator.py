import time, random, requests

URL = "http://localhost:8000/events"

while True:
    payload={
        "source": "expense-system",
        "type": "metric",
        "name": "payment_failure_rate",
        "value": random.randint(1, 15),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    
    }
    requests.post(URL, json=payload)
    time.sleep(3)