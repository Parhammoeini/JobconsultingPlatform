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
  const [loginInfo, setLoginInfo] = useState(null);
  // Add these with your other useState hooks
 // TOP of your App component
  const [userId, setUserId] = useState(null);     
  const [userRole, setUserRole] = useState(null); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  

  // Load services immediately after login
  useEffect(() => {
  if (view === "dashboard") {
    getServices().then(res => setServices(res.data));
    fetchMyBookings(); // Add this line here
  }
}, [view]);

const fetchMyBookings = async () => {
  if (!userId) return;
  try {
    const res = await API.get(`/client/bookings?clientId=${userId}`);
    setMyBookings(res.data || []);
  } catch (err) {
    console.error("Bookings fetch failed:", err);
    setMyBookings([]);
  }
};

const fetchServices = async () => {
  try {
    // If your teammate added /api to all controllers:
    const res = await API.get("/client/services"); 
    setServices(res.data || []);
  } catch (err) {
    console.error("Fetch services failed", err);
  }
};


const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await loginAndSave(credentials);
    const info = res.data;
    
    setLoginInfo(info);
    setUserId(info.userId || info.id || 44);
    setUsername(info.username || info.name);

    // CRITICAL: Logic to determine role based on what the server sends
    let detectedRole = "CLIENT"; 
    
    if (info.role) {
      detectedRole = info.role.toUpperCase();
    } else if (info.specialization || info.status) {
      // If the object has consultant-specific fields, it's a consultant!
      detectedRole = "CONSULTANT";
    }

    setUserRole(detectedRole);
    localStorage.setItem("userRole", detectedRole);

    // Routing
    if (detectedRole === "CONSULTANT") {
      setView("consultant");
    } else if (detectedRole === "ADMIN") {
      setView("admin");
    } else {
      setView("dashboard");
    }

    await fetchServices();
  } catch (err) {
    alert("Login failed");
  }
};


    


  const [chatHistory, setChatHistory] = useState([
  { role: 'ai', text: "Hello! I'm your JobConsulting Assistant. How can I help you with your career journey today?" }
  ]);
// AI
const handleAiConsult = async () => {
  // Use a local variable for the message so we don't rely on 'profile' 
  // after it might have been cleared by other parts of the app.
  const userQuery = profile.trim();
  if (!userQuery) return;

  // 1. UI Updates
  const newUserMsg = { role: 'user', text: userQuery };
  setChatHistory(prev => [...prev, newUserMsg]);
  setLoading(true);

  // 2. Normalize input for matching
  const lowerInput = userQuery.toLowerCase();
  let aiResponseText = "";

  try {
    // FAQ / Intent Logic
    if (lowerInput.includes("how do i book") || lowerInput.includes("process")) {
      aiResponseText = "Booking is simple: 1️⃣ Browse 'Available Services'. 2️⃣ Click 'Request'. 3️⃣ Wait for Consultant Approval. 4️⃣ Once 'APPROVED', click 'Pay Now' in your Journey Tracker.";
    } 
    else if (lowerInput.includes("payment") || lowerInput.includes("pay") || lowerInput.includes("cost")) {
      aiResponseText = "We support multiple payment methods. Our backend uses the **Strategy Design Pattern** to toggle between Credit Card and PayPal processing seamlessly.";
    } 
    else if (lowerInput.includes("status") || lowerInput.includes("where is my")) {
      aiResponseText = "Check your 'My Journey' section! Your request moves from **REQUESTED** ➔ **APPROVED** ➔ **PAID**.";
    }
    else if (lowerInput.includes("services") || lowerInput.includes("expert") || lowerInput.includes("help")) {
      aiResponseText = "We offer 6 specialized tracks: **Resume Review, Mock Interviews, Career Strategy, LinkedIn Optimization, Salary Coaching, and General Mentorship**.";
    }

    // Smart Bio / AI Logic
    else if (lowerInput.length > 15 || lowerInput.includes("i am") || lowerInput.includes("background")) {
      // First, check for CS student keywords locally for "Instant Smart" feel
      if (lowerInput.includes("cs") || lowerInput.includes("computer science")) {
        aiResponseText = "🧠 **AI Analysis:** Since you are a CS student, I highly recommend a **Mock Interview** to prep for technical rounds or a **Resume Review** for your projects.";
      } else {
        // Otherwise, hit the real AI backend
        const res = await suggestServices({ bio: userQuery }); 
        aiResponseText = `🧠 **AI Analysis:** I recommend **${res.data.recommendedService || "Career Strategy"}**. \n\nReason: ${res.data.reason || "This aligns with your professional background."}`;
      }
    }
    else {
      aiResponseText = "I'm your Career Assistant! Ask me about 'booking', 'payment', or tell me your background for a recommendation.";
    }

  } catch (err) {
    console.error("Chat Error:", err);
    aiResponseText = "I'm currently in offline mode, but based on your query, I'd start with a **Resume Review**!";
  }

  // 3. Final UI Sync
  setChatHistory(prev => [...prev, { role: 'ai', text: aiResponseText }]);
  setProfile(""); // Clear the text box
  setLoading(false);
};
/*
  // To Request a Booking:
  const handleRequestBooking = async (service) => {
  try {
    const payload = {
      clientId: userId,
      consultantId: service.consultantId || service.consultant_id,
      serviceType: service.serviceType || service.service_type,
      basePrice: service.basePrice || service.base_price,
      availabilityId: (service.id + 200) 
    };

    // CHANGE THIS LINE to match your teammate's new path
    await API.post("/client/bookings", payload); 
    
    alert("Request Sent!");
    fetchMyBookings();
  } catch (err) {
    console.error(err);
    alert("Booking failed: " + err.message);
  }
};*/
const handleRequestBooking = async (service) => {
  try {
    const payload = {
      clientId: userId,           // Must match Java's Long clientId
      consultantId: service.consultantId || 1, 
      serviceId: service.id,
      availabilitySlotId: 1       // Ensure you have a default slot if none selected
    };
    
    await requestBooking(payload);
    alert("Booking Requested!");
    fetchMyBookings();
  } catch (err) {
    console.error(err.response.data);
    alert("Booking failed: " + (err.response?.data?.error || "Server Error"));
  }
};

// GET STATUS
   const getStatusStyle = (state) => {
    switch (state) {
    case 'PAID': return { background: '#00b894', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
    case 'PENDING_PAYMENT': return { background: '#fdcb6e', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
    case 'REQUESTED': return { background: '#0984e3', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
    case 'CANCELLED': return { background: '#636e72', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
    default: return { background: '#dfe6e9', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
  }
};


// HANDLE LOGOUT
const handleLogout = () => {
  // 1. Clear the data arrays
  setChatHistory([]);
  setMyBookings([]);
  
  // 2. Clear user session
  setUserId(null);
  setUserRole(null);
  setProfile(""); 
  
  // 3. Redirect to login
  setView("login");
};
//HANDLE CANCEL
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

// --- RENDER LOGIC ---
// --- 1. SPECIALIZED FULL-SCREEN VIEWS (MENTOR FLOW) ---
  if (view === "mentor-benefits") return <BecomeMentor setView={setView} />;
  if (view === "mentor-form") return <MentorApplication setView={setView} />;

  // --- 2. LOGIN VIEW (NO NAVBAR) ---
  if (view === "login") {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={{ color: "#2d3436", marginBottom: "10px" }}>JobConsulting.ai</h1>
          <p style={{ color: "#636e72", marginBottom: "30px" }}>Phase 2: Expert Career Guidance</p>
          
          <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
            <input 
              type="text" 
              placeholder="Username" 
              required 
              style={styles.input} 
              onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              style={styles.input} 
              onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
            />
            <button type="submit" style={styles.loginBtn}>Enter Platform</button>
          </form>

          <button
            onClick={() => {
              const pwd = prompt("Enter admin password:");
              if (pwd === "admin123") setView("admin");
              else alert("Incorrect password");
            }}
            style={{ 
              marginTop: "15px", padding: "10px", background: "#2d3436", color: "white", 
              border: "none", borderRadius: "8px", cursor: "pointer", width: "100%", fontSize: "12px"
            }}
          >
            Admin Portal Access
          </button>
        </div>
      </div>
    );
  }

  // --- 3. MAIN DASHBOARD CONTAINER (ADMIN, STAFF, OR CLIENT) ---
  return (
    <div style={styles.dashboardContainer}>
      <nav style={styles.navbar}>
        <span style={styles.logo}>
          JobConsulting.ai {view === "admin" ? "(Admin)" : userRole === 'CONSULTANT' ? "(Staff)" : "(Client)"}
        </span>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {/* Become Consultant button: Only show for Clients who aren't in Admin view */}
          {userRole !== 'CONSULTANT' && view !== "admin" && (
            <button 
              onClick={() => setView("mentor-benefits")} 
              style={{ 
                backgroundColor: "#0984e3", color: "white", borderRadius: "20px", 
                padding: "8px 16px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px"
              }}
            >
              Become a Consultant
            </button>
          )}
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        {/* ROUTING ENGINE */}
        {view === "admin" ? (
          <AdminDashboard />
        ) : userRole === "CONSULTANT" ? (
          /* STAFF VIEW */
          <ConsultantDashboard 
            setView={setView} 
            loginInfo={{ username, userId }} 
          />
        ) : (
          /* CLIENT VIEW */
          <>
            <section style={styles.bookingTracker}>
              <h3>📅 My Journey & History</h3>
              {myBookings.length === 0 ? (
                <p style={{ color: "#999" }}>No active requests yet.</p>
              ) : (
                myBookings.map(b => (
                  <div key={b.id} style={styles.bookingRow}>
                    <div>
                      <strong>{b.serviceType || "Expert Session"}</strong>
                      <div style={{ display: 'flex', gap: '10px' }}>
                         <span style={getStatusStyle(b.state)}>{b.state}</span>
                         <span>${b.basePrice}</span>
                      </div>
                    </div>
                    <div style={styles.actionGroup}>
                      {b.state === "REQUESTED" && <button onClick={() => handleCancel(b.id)} style={styles.cancelBtn}>🚫 Cancel</button>}
                      {b.state === "PENDING_PAYMENT" && <button onClick={() => setSelectedService(b)} style={styles.payBtn}>💳 Pay</button>}
                    </div>
                  </div>
                ))
              )}
            </section>

            <section style={styles.aiHeader}>
              <h2>🤖 AI Career Guide</h2>
              <div style={styles.chatThread}>
                {chatHistory.map((msg, i) => (
                  <div key={i} style={msg.role === 'ai' ? styles.aiBubble : styles.userBubble}>{msg.text}</div>
                ))}
              </div>
              <div style={styles.inputGroup}>
                <input value={profile} onChange={(e) => setProfile(e.target.value)} placeholder="Ask AI..." style={styles.chatInput} />
                <button onClick={handleAiConsult} style={styles.sendBtn}>Send</button>
              </div>
            </section>

            <section style={styles.serviceSection}>
              <h3>💼 Available Expert Services</h3>
              <div style={styles.grid}>
                {services.map(s => (
                  <div key={s.id} style={styles.serviceCard}>
                    <h4>{s.serviceType || s.service_type}</h4>
                    <p>{s.description}</p>
                    <button onClick={() => handleRequestBooking(s)} style={styles.bookBtn}>Request - ${s.basePrice || s.base_price}</button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Payment Modal */}
        {selectedService && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>💳 Checkout: {selectedService.serviceType || selectedService.service_type}</h3>
              <button onClick={handleFinalPayment} style={styles.confirmBtn}>Confirm Payment</button>
              <button onClick={() => setSelectedService(null)} style={styles.cancelBtn}>Close</button>
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
  },
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  },
  loginCard: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    margin: '8px 0 20px 0',
    borderRadius: '10px',
    border: '1px solid #dfe6e9',
    fontSize: '16px',
    boxSizing: 'border-box', // Crucial so padding doesn't break width
  },
  loginBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#6c5ce7',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)',
    transition: 'transform 0.1s ease',}

};

export default App;