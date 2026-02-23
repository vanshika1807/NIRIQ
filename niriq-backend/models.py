from pydantic import BaseModel
from typing import Optional

class Event (BaseModel):
    source: str
    type: str
    name : Optional[str]
    value : Optional[float]
    message : Optional [str]
    timestamp : str