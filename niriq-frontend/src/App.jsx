import React, { useState, useEffect } from "react";


// const mockTimeline = [
//   { time: "12:01", event: "Deployment pipeline triggered" },
//   { time: "12:03", event: "Container initialization started" },
//   { time: "12:04", event: "Null reference exception detected" },
//   { time: "12:05", event: "Health checks failing" },
//   { time: "12:06", event: "Incident auto-created" }
// ];

// const mockAIActivity = [
//   { id: 1, action: "Analyzing logs", status: "COMPLETED" },
//   { id: 2, action: "Correlating metrics", status: "COMPLETED" },
//   { id: 3, action: "Identifying probable cause", status: "COMPLETED" },
//   { id: 4, action: "Generating remediation steps", status: "IN_PROGRESS" }
// ];

// const mockAnalysis = {
//   predictedCategory: "Deployment Failure",
//   predictedSeverity: "HIGH",
//   confidence: 0.92,
//   probableCause: "Null reference during container initialization",
//   suggestedActions: [
//     "Check recent code changes",
//     "Validate dependency injection config",
//     "Rollback latest deployment if needed"
//   ]
// };

function SeverityBadge({ severity }) {
  const styles = {
    CRITICAL: "bg-red-500/20 text-red-400",
    HIGH: "bg-orange-500/20 text-orange-400",
    MEDIUM: "bg-yellow-500/20 text-yellow-400",
    LOW: "bg-green-500/20 text-green-400"
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[severity] || ""}`}>
      {severity}
    </span>
  );
}

function ActivityStatus({ status }) {
  const styles = {
    COMPLETED: "text-green-400",
    IN_PROGRESS: "text-blue-400",
    FAILED: "text-red-400"
  };

  return <span className={`text-xs ${styles[status] || ""}`}>{status}</span>;
}

// <-----------------Main Dashboard----------------->

export default function Dashboard() {

  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const[error, setError] = useState(null);

// <---------------fetching Incident Details------------>  

useEffect(() => {
  const fetchIncidents = async () => {
    try {
      const res = await fetch("http://localhost:8000/incidents");
      if( !res.ok) throw new Error("Failed to fetch incidents");

      const data = await res.json();
      setIncidents(data);

      if(data.length > 0 && !selectedIncident) {
        setSelectedIncident(data[0]);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  fetchIncidents();
  const interval = setInterval(fetchIncidents, 3000);

  return() => clearInterval(interval);
}, [selectedIncident]);

// <------------------States-------------->

if (loading) {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
       <h1 className="text-2xl font-semibold">NIRIQ Monitoring Console</h1>
        <p className="text-slate-400 text-sm">Initializing incidnt stream.....</p>
    </div>
  );
}

if(error) {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
       <h1 className="text-2xl font-semibold">NIRIQ Monitoring Console</h1>
        <p className="text-slate-400 text-sm">Error: {error}</p>
    </div>
  );
}

if(!selectedIncident) {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
       <h1 className="text-2xl font-semibold">NIRIQ Monitoring Console</h1>
        <p className="text-slate-400 text-sm">Waiting for Incidents from conected systems.....</p>
    </div>
  );
}

// <-------main UI-------------->  

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">NIRIQ Monitoring Console</h1>
        <p className="text-slate-400 text-sm">AI-Assisted Incident Intelligence & Response</p>
      </div>

      <div className="grid grid-cols-8 gap-4">
        {/* Incident Feed */}
        <div className="col-span-3 bg-slate-900 rounded-2xl p-4 shadow-lg">
          <h2 className="text-sm font-medium mb-4 text-slate-300">Active Incidents</h2>

          <div className="space-y-2">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${selectedIncident.id === incident.id
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-900 border-slate-800 hover:bg-slate-800"
                  }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400">{incident.id}</span>
                  <SeverityBadge severity={incident.severity} />
                </div>

                <p className="text-sm font-medium">{incident.title}</p>
                <p className="text-xs text-slate-500">{incident.service} • {incident.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Panels */}
        <div className="col-span-5 grid grid-rows-2 gap-4">
          {/* Incident Drill-Down */}
          <div className="bg-slate-900 rounded-2xl p-4 shadow-lg">
            <h2 className="text-sm font-medium mb-3 text-slate-300">Incident Drill-Down</h2>

            <div className="grid grid-cols-12 gap-4 text-sm">
              <div className="col-span-1">
                <p className="text-slate-400 text-xs mb-2">Incident Info</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-slate-500 text-xs">Title</p>
                    <p>{selectedIncident.title}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Service</p>
                    <p>{selectedIncident.service}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Severity</p>
                    <SeverityBadge severity={selectedIncident.severity} />
                  </div>
                </div>
              </div>

              <div className="col-span-9">
                <p className="text-slate-400 text-xs mb-2">Event Timeline</p>
                <div className="bg-slate-950 rounded-xl p-3 space-y-2">
                  {(selectedIncident.timeline || []).map((item,  i) => (
                    <div key={i} className="flex text-xs">
                      <span className="text-slate-500 w-12">{item.time}</span>
                      <span className="text-slate-300">{item.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Panels */}
          <div className="grid grid-cols-2 gap-4">
            {/* AI Analysis */}
            <div className="bg-slate-900 rounded-2xl p-4 shadow-lg">
              <h2 className="text-sm font-medium mb-3 text-slate-300">AI Incident Analysis</h2>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400 text-xs">Probable Cause</p>
                  <p>{selectedIncident.analysis?.probableCause}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Confidence</p>
                  <div className="w-full bg-slate-800 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(selectedIncident.analysis?.confidence || 0) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Suggested Actions</p>
                  <ul className="list-disc list-inside text-slate-300 text-xs space-y-1">
                    {(selectedIncident.analysis?.suggestedActions || []).map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Activity Feed */}
            <div className="bg-slate-900 rounded-2xl p-4 shadow-lg">
              <h2 className="text-sm font-medium mb-3 text-slate-300">AI Activity Feed</h2>

              <div className="space-y-2">
                {(selectedIncident.agent_activty || []).map((item, i) => (
                  <div key={i} 
                  className="flex justify-between text-xs bg-slate-950 p-2 rounded-lg">
                    <span className="text-slate-300">{item.action}</span>
                    <ActivityStatus status={item.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
