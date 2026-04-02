import React, { useState, useEffect } from "react";
import Availability from "./Availability";
import Booking from "./Booking";
import Payment from "./payment"; 
import { suggestServices, signupUser, getConsultants, getServices } from "./api"; 

function App() {
  const [view, setView] = useState("login");
  const [profile, setProfile] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [signupData, setSignupData] = useState({ username: "", password: "", role: "CLIENT" });
  
  const [consultants, setConsultants] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (view === "dashboard") {
      getConsultants().then(res => setConsultants(res.data)).catch(err => console.log(err));
      getServices().then(res => setServices(res.data)).catch(err => console.log(err));
    }
  }, [view]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signupUser(signupData);
      alert("Account created! Please log in.");
      setView("login");
    } catch (err) {
      alert("Signup failed. Check backend logs.");
    }
  };

  const handleAiConsult = async () => {
    setAiResponse("AI is analyzing your profile...");
    try {
      const res = await suggestServices(profile);
      setAiResponse(res.data);
    } catch (err) {
      setAiResponse("Error connecting to AI service.");
    }
  };

  // --- VIEW: DASHBOARD ---
  if (view === "dashboard") {
    return (
      <div style={{ padding: "20px", fontFamily: 'Segoe UI', backgroundColor: "#f9f9f9" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Consulting Portal</h1>
          <button onClick={() => setView("login")} style={{ padding: "10px", background: "#ff4d4d", color: "white", border: "none", borderRadius: "5px" }}>Logout</button>
        </header>

        <section style={{ margin: "20px 0" }}>
          <h2>🌟 Featured Consultants</h2>
          <div style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "10px 0" }}>
            {consultants.length > 0 ? consultants.map(c => (
              <div key={c.id} style={{ minWidth: "220px", padding: "15px", background: "white", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{c.name}</div>
                <p style={{ color: "#666" }}>Expert Consultant</p>
              </div>
            )) : <p>Loading Consultants...</p>}
          </div>
        </section>

        <hr />

        <section style={{ margin: "30px 0" }}>
          <h2>💼 Service Catalog</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {services.map(s => (
              <div key={s.id} style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid #e0e0e0" }}>
                <h3 style={{ color: "#007bff" }}>{s.service_type}</h3>
                <p>{s.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                  <span style={{ fontWeight: "bold" }}>${s.base_price}</span>
                  <button onClick={() => setSelectedService(s)} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "6px" }}>Book & Pay</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedService && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 }}>
            <div style={{ background: "white", padding: "30px", borderRadius: "15px", width: "90%", maxWidth: "500px", position: "relative" }}>
              <button onClick={() => setSelectedService(null)} style={{ position: "absolute", top: "15px", right: "15px", border: "none", background: "none", fontSize: "1.2rem" }}>✖</button>
              <Payment selectedService={selectedService} onClose={() => setSelectedService(null)} />
            </div>
          </div>
        )}

        <section style={{ marginTop: "50px", padding: "25px", background: "#343a40", color: "white", borderRadius: "12px" }}>
          <h2>🤖 AI Career Assistant</h2>
          <textarea value={profile} onChange={(e) => setProfile(e.target.value)} placeholder="Ask for advice..." style={{ width: "100%", height: "90px", borderRadius: "8px", padding: "12px", color: "#333" }} />
          <button onClick={handleAiConsult} style={{ marginTop: "12px", padding: "10px 25px", background: "#007bff", color: "white", border: "none", borderRadius: "6px" }}>Get Guidance</button>
          {aiResponse && <div style={{ marginTop: "20px", padding: "15px", background: "rgba(255,255,255,0.1)", borderRadius: "8px", borderLeft: "4px solid #007bff" }}>{aiResponse}</div>}
        </section>
      </div>
    );
  }

  // --- VIEW: SIGNUP ---
  if (view === "signup") {
    return (
      <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
        <h1>Create Account</h1>
        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input type="text" placeholder="Username" onChange={(e) => setSignupData({...signupData, username: e.target.value})} required />
          <input type="password" placeholder="Password" onChange={(e) => setSignupData({...signupData, password: e.target.value})} required />
          <select onChange={(e) => setSignupData({...signupData, role: e.target.value})}>
            <option value="CLIENT">Client</option>
            <option value="CONSULTANT">Consultant</option>
          </select>
          <button type="submit" style={{ padding: "10px", background: "#007bff", color: "white", border: "none" }}>Sign Up</button>
        </form>
        <p>Already have an account? <a href="#" onClick={() => setView("login")}>Login here</a></p>
      </div>
    );
  }

  // --- VIEW: LOGIN (Default) ---
  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h1>Login</h1>
      <input type="text" placeholder="Username" style={{ width: "100%", marginBottom: "10px" }} />
      <input type="password" placeholder="Password" style={{ width: "100%", marginBottom: "10px" }} />
      <button onClick={() => setView("dashboard")} style={{ width: "100%", padding: "10px", background: "green", color: "white" }}>
        Login (Demo Mode)
      </button>
      <p>Don't have an account? <a href="#" onClick={() => setView("signup")}>Sign up</a></p>
    </div>
  );
}

export default App;