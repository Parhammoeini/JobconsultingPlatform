import AdminDashboard from "./AdminDashboard";
import React, { useState, useEffect } from "react";
import Payment from "./payment"; 
import BecomeMentor from "./BecomeMentor";
import MentorApplication from "./MentorApplication";
import ConsultantDashboard from "./ConsultantDashboard";
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
<<<<<<< HEAD
  const [loginInfo, setLoginInfo] = useState(null);
=======
  
  
>>>>>>> 4b9ed38 (Finalizing AI assistant and payment features for Phase 2)

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
      const res = await loginAndSave(credentials);
      const info = res.data;
      setLoginInfo(info);
      if (info.role === "CONSULTANT" && info.status === "APPROVED") {
        setView("consultant");
      } else {
        setView("dashboard");
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.error || err.response?.data || err.message));
    }
  };

  const [chatHistory, setChatHistory] = useState([
  { role: 'ai', text: "Hello! I'm your JobConsulting Assistant. How can I help you with your career journey today?" }
  ]);

const handleAiConsult = async () => {
  if (!profile.trim()) return;

  // 1. Add User Message to history
  const newUserMsg = { role: 'user', text: profile };
  setChatHistory(prev => [...prev, newUserMsg]);
  setLoading(true);

  const input = profile.toLowerCase();
  let aiResponseText = "";

  // 2. Intent-Based Dialogue Logic (Per Assignment Requirements)
  if (input.includes("how do i book") || input.includes("process")) {
    aiResponseText = "Booking is easy! 1️⃣ Browse the 'Available Services' below. 2️⃣ Click 'Request Appointment'. 3️⃣ Once a consultant approves, you'll see a 'Pay Now' button in your 'My Journey' tracker.";
  } else if (input.includes("payment") || input.includes("pay")) {
    aiResponseText = "We accept Credit Cards and PayPal. We use a 'Strategy Design Pattern' to securely process your chosen method at checkout.";
  } else if (input.includes("cancel")) {
    aiResponseText = "You can cancel any booking in the 'REQUESTED' state. Once paid, the status moves to 'PAID' and the slot is locked.";
  } else if (input.includes("services") || input.includes("what types")) {
    aiResponseText = "We offer 6 core services: Resume Review, Mock Interviews, Career Strategy, LinkedIn Optimization, Salary Negotiation, and general Coaching.";
  } else {
    // Fallback to your existing AI API for personalized recommendations
    try {
      const res = await suggestServices(profile);
      aiResponseText = res.data.recommendation;
    } catch {
      aiResponseText = "I'm here to help! Try asking: 'How do I book?' or 'What services do you have?'";
    }
  }

  // 3. Add AI Response to history
  setChatHistory(prev => [...prev, { role: 'ai', text: aiResponseText }]);
  setProfile(""); // Clear input
  setLoading(false);
};

  // To Request a Booking:
  const handleRequestBooking = async (service) => {
  try {
    const requestData = {
      clientId: 1, 
      // Use the actual consultant from the service card
      consultantId: service.consultant_id || service.consultantId, 
      // Dynamically pick the slot ID (we mapped them to match in the SQL above)
      availabilitySlotId: service.id + 200, 
      serviceId: service.id
    };

    await API.post("/client/bookings", requestData);
    alert(`Request for ${service.serviceType || service.service_type} sent!`);
    fetchMyBookings();
  } catch (err) {
    alert("Booking failed: " + (err.response?.data?.error || err.message));
  }
};

   const getStatusStyle = (state) => {
    switch (state) {
    case 'PAID': return { background: '#00b894', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
    case 'PENDING_PAYMENT': return { background: '#fdcb6e', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
    case 'REQUESTED': return { background: '#0984e3', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
    case 'CANCELLED': return { background: '#636e72', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
    default: return { background: '#dfe6e9', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
  }
};
const handleCancel = async (bookingId) => {
  // 1. UI Confirmation
  const confirmCancel = window.confirm("Are you sure you want to cancel this request?");
  if (!confirmCancel) return;

  try {
    // 2. Call the Backend (Matches your PUT /api/client/bookings/{id}/cancel)
    // We pass the clientId to verify ownership
    await API.put(`/client/bookings/${bookingId}/cancel`, { 
      clientId: 1 
    });

    alert("Booking successfully cancelled. The slot is now available for others.");
    
    // 3. Refresh the UI
    fetchMyBookings(); 
  } catch (err) {
    console.error("Cancel Error:", err);
    alert("Could not cancel: " + (err.response?.data?.error || "Server error"));
  }
};


if (view === "admin") {
  return (
    <div style={{ padding: "20px" }}>
      <button 
        onClick={() => setView("login")} 
        style={{ marginBottom: "20px", padding: "8px 20px", background: "#d63031", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
      >
        ← Back to Login
      </button>
      <AdminDashboard />
    </div>
  );
}

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
          <button
            onClick={() => {
            const pwd = prompt("Enter admin password:");
            if (pwd === "admin123") {
            setView("admin");
            } else {
            alert("Incorrect password");
            }
          }}
            style={{ marginTop: "15px", padding: "10px 20px", background: "#2d3436", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", width: "100%" }}

          >
          Admin Panel
        </button>
        </div>
      </div>
    );
  }

  if (view === "consultant") {
    return <ConsultantDashboard setView={setView} loginInfo={loginInfo} />;
  }

  if (view === "mentor-benefits") {
    return <BecomeMentor setView={setView} />;
  }

  if (view === "mentor-form") {
    return <MentorApplication setView={setView} />;
  }

  // --- DASHBOARD VIEW (USER FOCUS) ---
  return (
    <div style={styles.dashboardContainer}>
      <nav style={styles.navbar}>
        <span style={styles.logo}>JobConsulting.ai</span>
        <div>
          <button onClick={() => setView("mentor-benefits")} style={{ ...styles.navBtn, marginRight: "10px", backgroundColor: "#0984e3", color: "white", borderRadius: "20px", padding: "8px 16px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Become a Consultant</button>
          <button onClick={() => setView("login")} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        
     {/* SECTION 1: BOOKING & PAYMENT TRACKER (State + Strategy Pattern) */}
<section style={styles.bookingTracker}>
  <h3>📅 My Journey & History</h3>
  {myBookings.length === 0 ? (
    <p style={{ color: "#999" }}>No active requests yet. Start by consulting our AI guide!</p>
  ) : (
    myBookings.map(b => (
      <div key={b.id} style={styles.bookingRow}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <strong style={{ color: "#2d3436" }}>{b.serviceType || "Consulting Session"}</strong> 
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
             <span style={getStatusStyle(b.state)}>{b.state}</span>
             <span style={{ color: "#636e72", fontSize: "14px" }}>${b.basePrice}</span>
          </div>
        </div>
        
        <div style={styles.actionGroup}>
          {/* 1. CANCEL FEATURE (Required) */}
          {b.state === "REQUESTED" && (
            <button 
              onClick={() => handleCancel(b.id)} 
              style={styles.cancelBtn}
            >
              🚫 Cancel
            </button>
          )}

          {/* 2. TRIGGER STRATEGY PATTERN (Required) */}
          {b.state === "PENDING_PAYMENT" && (
            <button 
              onClick={() => setSelectedService(b)} 
              style={styles.payBtn}
            >
              💳 Pay Now
            </button>
          )}

          {/* 3. PAYMENT HISTORY (Required) */}
          {b.state === "PAID" && (
            <span style={{ color: "#00b894", fontWeight: "bold" }}>✅ Receipt Issued</span>
          )}
        </div>
      </div>
    ))
  )}
</section>
      <header style={styles.aiHeader}>
    <h2>🤖 AI Career Guide</h2>
    <div style={styles.chatWindow}>
    <div style={styles.chatThread}>
      {chatHistory.map((msg, i) => (
        <div key={i} style={msg.role === 'ai' ? styles.aiBubble : styles.userBubble}>
          <strong>{msg.role === 'ai' ? "AI: " : "You: "}</strong>{msg.text}
        </div>
      ))}
      {loading && <div style={styles.aiBubble}><em>Thinking...</em></div>}
      </div>
    
    <div style={styles.inputGroup}>
      <input 
        value={profile} 
        onChange={(e) => setProfile(e.target.value)} 
        onKeyPress={(e) => e.key === 'Enter' && handleAiConsult()}
        placeholder="Ask about booking, payments, or your career..." 
        style={styles.chatInput}
      />
      <button onClick={handleAiConsult} style={styles.sendBtn}>Send</button>
    </div>
  </div>
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
        {selectedService && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h3>💳 Checkout: {selectedService.serviceType}</h3>
      <p>Amount Due: <strong>${selectedService.basePrice}</strong></p>
      
      <label style={{display: 'block', marginBottom: '10px'}}>Select Payment Method:</label>
      <select 
        style={styles.select} 
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="CREDIT_CARD">Visa/Mastercard (**** 4242)</option>
        <option value="PAYPAL">PayPal (User: {profile || "parham@yorku.ca"})</option>
      </select>

      <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
        <button onClick={handleFinalPayment} style={styles.confirmBtn}>Confirm Payment</button>
        <button onClick={() => setSelectedService(null)} style={styles.cancelBtn}>Close</button>
      </div>
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
  chatWindow: {
    background: "#f8f9fa",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e9ecef",
    display: "flex",
    flexDirection: "column",
    height: "400px"
  },
  chatThread: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  aiBubble: {
    alignSelf: "flex-start",
    background: "#ffffff",
    padding: "10px 15px",
    borderRadius: "15px 15px 15px 0",
    maxWidth: "80%",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    color: "#2d3436",
    fontSize: "14px",
    border: "1px solid #dee2e6"
  },
  userBubble: {
    alignSelf: "flex-end",
    background: "#0984e3",
    color: "white",
    padding: "10px 15px",
    borderRadius: "15px 15px 0 15px",
    maxWidth: "80%",
    fontSize: "14px"
  },
  inputGroup: { display: "flex", gap: "10px" },
  chatInput: { flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" },
  sendBtn: { background: "#0984e3", color: "white", border: "none", padding: "0 20px", borderRadius: "8px", cursor: "pointer" },
  bookingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    background: "#f9f9f9",
    borderRadius: "10px",
    marginBottom: "10px",
    border: "1px solid #eee"
  },
  actionGroup: {
    display: "flex",
    gap: "10px"
  },
  cancelBtn: {
    background: "#ff7675",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px"
  },
  payBtn: {
    background: "#0984e3",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold"
  }

};

export default App;