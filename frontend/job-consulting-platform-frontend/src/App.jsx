import React, { useState, useEffect } from "react";
import Availability from "./Availability";
import Booking from "./Booking";
import Payment from "./payment"; 
import SystemStatus from "./SystemStatus";
import ConsultantApproval from "./ConsultantApproval";
import PolicyManager from "./PolicyManager";
import { suggestServices, loginAndSave, getConsultants, getServices } from "./api"; 

function App() {
  const [view, setView] = useState("login");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [profile, setProfile] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [consultants, setConsultants] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  // Sync data when entering dashboard or admin views
  useEffect(() => {
    if (view === "dashboard" || view === "admin") {
      getConsultants().then(res => setConsultants(res.data)).catch(err => console.log(err));
      getServices().then(res => setServices(res.data)).catch(err => console.log(err));
    }
  }, [view]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginAndSave(credentials);
      alert(response.data); 
      setView("dashboard"); 
    } catch (err) {
      alert("Error saving to DB: " + (err.response?.data || err.message));
    }
  };

  const handleAiConsult = async () => {
    setAiResponse("AI is thinking...");
    try {
      const res = await suggestServices(profile);
      setAiResponse(res.data);
    } catch (err) {
      setAiResponse("AI Service Unavailable.");
    }
  };

  // --- VIEW: ADMIN (Teammate's Management Tools) ---
  if (view === "admin") {
    return (
      <div style={{ padding: "20px" }}>
        <button onClick={() => setView("login")} style={{ float: "right" }}>Logout</button>
        <h1>Admin Control Panel</h1>
        <SystemStatus />
        <hr />
        <ConsultantApproval />
        <hr />
        <PolicyManager />
        <hr />
        <Availability />
      </div>
    );
  }

  // --- VIEW: DASHBOARD (Your Service & Payment Strategy) ---
  if (view === "dashboard") {
    return (
      <div style={{ padding: "20px" }}>
        <button onClick={() => setView("login")} style={{ float: "right" }}>Logout</button>
        <h1>Client Dashboard</h1>
        
        <section style={{ marginBottom: "40px" }}>
          <h2>🤖 AI Career Consultant</h2>
          <textarea value={profile} onChange={(e) => setProfile(e.target.value)} placeholder="Describe your goals..." style={{ width: "100%", height: "80px" }} />
          <button onClick={handleAiConsult} style={{ marginTop: "10px" }}>Ask AI</button>
          <div style={{ marginTop: "10px", background: "#f0f0f0", padding: "10px" }}>{aiResponse}</div>
        </section>

        <section>
          <h2>💼 Available Services</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            {services.map(s => (
              <div key={s.id} style={{ border: "1px solid #007bff", padding: "15px", borderRadius: "8px" }}>
                <h4>{s.service_type}</h4>
                <p>${s.base_price}</p>
                <button onClick={() => setSelectedService(s)} style={{ background: "#28a745", color: "white" }}>Book & Pay</button>
              </div>
            ))}
          </div>
        </section>

        {selectedService && (
          <div style={{ position: "fixed", top: "10%", left: "25%", width: "50%", background: "white", padding: "20px", border: "2px solid #000", zIndex: 1000 }}>
             <button onClick={() => setSelectedService(null)} style={{ float: "right" }}>Close</button>
             <Payment selectedService={selectedService} onClose={() => setSelectedService(null)} />
          </div>
        )}
      </div>
    );
  }

  // --- VIEW: LOGIN (Home) ---
  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <h1>Job Consulting - Phase 2</h1>
      <form onSubmit={handleLoginSubmit} style={{ marginBottom: "20px" }}>
        <input type="text" placeholder="Username" onChange={(e) => setCredentials({...credentials, username: e.target.value})} />
        <input type="password" placeholder="Password" onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
        <button type="submit">Login as Client</button>
      </form>
      <button onClick={() => setView("admin")} style={{ background: "#333", color: "white", padding: "10px 20px" }}>
        Enter Admin Panel
      </button>
    </div>
  );
}

export default App;