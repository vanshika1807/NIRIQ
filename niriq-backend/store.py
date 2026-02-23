incidents =[]
def add_incident(incident):
    incidents.insert(0, incident)

def get_incidents():
    return incidents[:10]