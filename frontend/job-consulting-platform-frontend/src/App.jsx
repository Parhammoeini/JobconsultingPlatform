import React, { useState, useEffect } from "react";
import Payment from "./payment"; 
import API, { 
  requestBooking,
  getMyBookings,
  suggestServices, 
  loginAndSave, 
  getConsultants, 
  getServices 
} from "./api";
/*
When the user clicks "Book & Pay," the serviceType is passed to the backend. Here is the flow:

Frontend (App.jsx): Sends service_id and client_id to the Backend.

Backend (ClientController.java): Calls catalogService.getServiceById(id). This returns the serviceType and the consultantId linked to that service in the database.

Payment Strategy (PaymentController.java):  Strategy Pattern takes over. Depending on the paymentMethod (Credit Card/PayPal) selected in the modal, it processes the basePrice belonging to that serviceType.
*/
function App() {
  const [view, setView] = useState("login");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [profile, setProfile] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myBookings, setMyBookings] = useState([]);

  // Load services immediately after login
  useEffect(() => {
  if (view === "dashboard") {
    getServices().then(res => setServices(res.data));
    fetchMyBookings(); // Add this line here
  }
}, [view]);

  const fetchMyBookings = async () => {
  try {
    const res = await API.get("/client/bookings", {
      params: { clientId: 1 } 
    });
    setMyBookings(res.data);
  } catch (err) {
    console.error("Error fetching bookings:", err);
  }
};
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginAndSave(credentials);
      setView("dashboard"); 
    } catch (err) {
      alert("Login failed: " + (err.response?.data || err.message));
    }
  };

  const handleAiConsult = async () => {
    setLoading(true);
    setAiResponse("");
    try {
      const res = await suggestServices(profile);
      setAiResponse(res.data);
    } catch (err) {
      setAiResponse("AI is currently offline. Please browse our standard services below.");
    } finally {
      setLoading(false);
    }
  };
  // To Request a Booking:
  const handleRequestBooking = async (service) => {
  try {
    const requestData = {
      clientId: 1, 
      consultantId: service.consultantId || service.consultant_id || 2, 
      availabilitySlotId: 101, 
      serviceId: service.id
    };

    await requestBooking(requestData); 
    
    alert("Request Sent! State is now: REQUESTED");
    
    const res = await getMyBookings(1);
    setMyBookings(res.data);
  } catch (err) {
    alert("Booking failed: " + (err.response?.data?.error || err.message));
  }
};
{myBookings.map(b => (
  <div key={b.id}>
    <span>{b.serviceType} - {b.state}</span>
    {b.state === "PENDING_PAYMENT" && (
      <button onClick={() => setSelectedService(b)}>Pay Now</button>
    )}
  </div>
))}
    const getStatusStyle = (state) => {
    switch (state) {
    case 'REQUESTED': 
      return { backgroundColor: '#ffeaa7', color: '#d63031', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
    case 'PENDING_PAYMENT': 
      return { backgroundColor: '#fab1a0', color: '#e17055', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
    case 'PAID': 
      return { backgroundColor: '#55efc4', color: '#00b894', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
    default: 
      return { backgroundColor: '#dfe6e9', color: '#636e72', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
  }
};


  // --- LOGIN VIEW ---
  if (view === "login") {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={{ color: "#2d3436", marginBottom: "10px" }}>JobConsulting.ai</h1>
          <p style={{ color: "#636e72", marginBottom: "30px" }}>Your personalized career path starts here.</p>
          <form onSubmit={handleLoginSubmit} style={styles.form}>
            <input type="text" placeholder="Username" required style={styles.input} onChange={(e) => setCredentials({...credentials, username: e.target.value})} />
            <input type="password" placeholder="Password" required style={styles.input} onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
            <button type="submit" style={styles.primaryBtn}>Enter Platform</button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW (USER FOCUS) ---
  return (
    <div style={styles.dashboardContainer}>
      <nav style={styles.navbar}>
        <span style={styles.logo}>JobConsulting.ai</span>
        <button onClick={() => setView("login")} style={styles.logoutBtn}>Logout</button>
      </nav>

      <div style={styles.content}>
        
        {/* SECTION 1: BOOKING TRACKER (State Pattern Demo) */}
        <section style={styles.bookingTracker}>
          <h3>📅 My Journey</h3>
          {myBookings.length === 0 ? (
            <p style={{ color: "#999" }}>No active requests yet. Start by consulting our AI guide!</p>
          ) : (
            myBookings.map(b => (
              <div key={b.id} style={styles.bookingRow}>
                <div>
                  <strong style={{ color: "#2d3436" }}>{b.serviceType || "Consulting Session"}</strong> 
                  <span style={getStatusStyle(b.state)}>
                    {b.state}
                  </span>
                </div>
                
                {/* TRIGGER STRATEGY PATTERN: Only show Pay button if PENDING_PAYMENT */}
                {b.state === "PENDING_PAYMENT" && (
                  <button 
                    onClick={() => setSelectedService(b)} 
                    style={styles.payBtn}
                  >
                    💳 Pay Now
                  </button>
                )}
              </div>
            ))
          )}
        </section>

        {/* SECTION 2: AI PERSONALIZATION (The "Brain") */}
        <header style={styles.aiHeader}>
          <h2>🤖 AI Career Guide</h2>
          <p>Tell us your background and we'll match you with a consultant.</p>
          <div style={styles.aiBox}>
            <textarea 
              value={profile} 
              onChange={(e) => setProfile(e.target.value)} 
              placeholder="Ex: I am a 3rd year CS student looking for a Java Backend internship..." 
              style={styles.textarea}
            />
            <button onClick={handleAiConsult} disabled={loading} style={styles.aiBtn}>
              {loading ? "Analyzing..." : "Get AI Recommendation"}
            </button>
          </div>
          {aiResponse && <div style={styles.aiResult}>{aiResponse}</div>}
        </header>

        {/* SECTION 3: SERVICE CATALOG (The Products) */}
        <section style={styles.serviceSection}>
          <h3>💼 Available Expert Services</h3>
          <div style={styles.grid}>
            {services.map(s => (
              <div key={s.id} style={styles.serviceCard}>
                <div style={styles.cardHeader}>
                  <h4>{s.serviceType || s.service_type}</h4>
                  <span style={styles.priceTag}>${s.basePrice || s.base_price}</span>
                </div>
                <p style={styles.description}>{s.description}</p>
                <div style={styles.consultantInfo}>
                  <span>👤 Expert: {s.consultantName || "Assigned on Request"}</span>
                </div>
                {/* This button starts the REQUEST flow, not the PAY flow */}
                <button onClick={() => handleRequestBooking(s)} style={styles.bookBtn}>
                  Request Appointment
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: PAYMENT MODAL (Strategy Pattern) */}
        {selectedService && (
          <div style={styles.modalOverlay}>
             <div style={styles.modal}>
               <button onClick={() => setSelectedService(null)} style={styles.closeBtn}>✕</button>
               <h3 style={{ marginTop: 0 }}>Complete Your Payment</h3>
               <p>Service: <strong>{selectedService.serviceType}</strong></p>
               <hr />
               <Payment selectedService={selectedService} onClose={() => setSelectedService(null)} />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- NICE CSS-IN-JS STYLES ---
const styles = {
  loginContainer: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f1f2f6" },
  loginCard: { background: "white", padding: "50px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center", width: "400px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", fontSize: "16px" },
  primaryBtn: { padding: "12px", background: "#0984e3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  dashboardContainer: { background: "#f9f9f9", minHeight: "100vh" },
  navbar: { padding: "15px 40px", background: "white", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  logo: { fontSize: "20px", fontWeight: "bold", color: "#0984e3" },
  logoutBtn: { background: "none", border: "1px solid #ff7675", color: "#ff7675", padding: "5px 15px", borderRadius: "5px", cursor: "pointer" },
  content: { maxWidth: "1100px", margin: "40px auto", padding: "0 20px" },
  aiHeader: { background: "white", padding: "30px", borderRadius: "15px", marginBottom: "40px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" },
  aiBox: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" },
  textarea: { height: "100px", padding: "15px", borderRadius: "10px", border: "1px solid #dfe6e9", fontSize: "16px", outline: "none" },
  aiBtn: { alignSelf: "flex-start", padding: "12px 25px", background: "#6c5ce7", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  aiResult: { marginTop: "20px", padding: "20px", background: "#f1f2f6", borderRadius: "10px", borderLeft: "5px solid #6c5ce7", lineHeight: "1.6" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" },
  serviceCard: { background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "15px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  priceTag: { fontSize: "20px", fontWeight: "bold", color: "#2ecc71" },
  description: { color: "#636e72", fontSize: "15px", lineHeight: "1.4" },
  bookBtn: { padding: "12px", background: "#00b894", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 },
  modal: { background: "white", padding: "40px", borderRadius: "20px", width: "90%", maxWidth: "550px", position: "relative" },
  closeBtn: { position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "20px", cursor: "pointer" },
  bookingTracker: { background: "white", padding: "25px", borderRadius: "15px", marginBottom: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  bookingRow: { borderBottom: "1px solid #eee", padding: "15px 0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  statusBadge: { marginLeft: "15px", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", textTransform: "uppercase" },
  payBtn: { background: "#00b894", color: "white", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", transition: "0.3s" },

};

export default App;