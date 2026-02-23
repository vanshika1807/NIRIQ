from pydantic import BaseModel
from typing import Literal

class Event(BaseModel):
    source: str
    type: Literal["metric", "log"]
    name: str
    value: float
    timestamp: str