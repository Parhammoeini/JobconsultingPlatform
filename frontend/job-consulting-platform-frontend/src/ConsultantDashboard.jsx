import React, { useState, useEffect } from "react";
import API from "./api";
import { getConsultantBookings, getServices } from './api';
const ConsultantDashboard = ({ setView, loginInfo }) => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [newSlot, setNewSlot] = useState({ start: "", end: "" });
  // Ensure it matches the field name from your Java Booking entity

  // Inside useEffect in ConsultantDashboard.jsx
/*useEffect(() => {
  // Use the consultant ID we passed from login
  const consultantId = loginInfo?.userId; 

  if (consultantId) {
    // These paths might need the /api prefix depending on your Java setup
    API.get(`/api/consultant/bookings?consultantId=${consultantId}`)
       .then(res => setBookings(res.data || []));
    
    API.get(`/api/consultant/availability?consultantId=${consultantId}`)
       .then(res => setAvailabilities(res.data || []));
  }
}, [loginInfo]);*/
useEffect(() => {
  // Use the dynamic ID from login, fallback to 46 for testing
  const id = loginInfo?.userId || 99;

  // 1. Fetch Bookings using the helper (Matches /client/bookings)
  getConsultantBookings(id)
    .then(res => {
      console.log("Bookings received:", res.data);
      setBookings(res.data || []);
    })
    .catch(err => console.error("Booking Fetch Error:", err));

  // 2. Fetch Services using the helper (Matches /client/services)
  getServices()
    .then(res => {
      setServices(res.data || []);
    })
    .catch(err => console.error("Services Fetch Error:", err));
}, [loginInfo]);



  const handleAccept = async (id) => {
    // await API.put(`/consultant/bookings/${id}/accept`);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, state: "CONFIRMED" } : b));
    alert("Booking Accepted!");
  };

  const handleReject = async (id) => {
    // await API.put(`/consultant/bookings/${id}/reject`);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, state: "REJECTED" } : b));
    alert("Booking Rejected.");
  };

  const handleComplete = async (id) => {
    // await API.put(`/consultant/bookings/${id}/complete`);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, state: "COMPLETED" } : b));
    alert("Session Marked as Completed!");
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    // await API.post("/consultant/availability", newSlot);
    setAvailabilities([...availabilities, { id: Date.now(), ...newSlot, status: "AVAILABLE" }]);
    alert("Time slot added!");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <button onClick={() => setView("login")} style={{ float: "right", padding: "8px 16px", cursor: "pointer" }}>Logout</button>
      <h1 style={{ color: "#2d3436" }}>Consultant Dashboard</h1>
      <p style={{ color: "#00b894", fontWeight: "bold" }}>🎉 Congrats {loginInfo?.username || ""}, you got approved to be a consultant!</p>

      <div style={{ display: "flex", gap: "15px", marginBottom: "30px", marginTop: "20px" }}>
        <button onClick={() => setActiveTab("bookings")} style={{ padding: "10px 20px", background: activeTab === "bookings" ? "#0984e3" : "#dfe6e9", color: activeTab === "bookings" ? "white" : "black", border: "none", borderRadius: "5px", cursor: "pointer" }}>Manage Bookings (UC9, UC10)</button>
        <button onClick={() => setActiveTab("availability")} style={{ padding: "10px 20px", background: activeTab === "availability" ? "#0984e3" : "#dfe6e9", color: activeTab === "availability" ? "white" : "black", border: "none", borderRadius: "5px", cursor: "pointer" }}>Manage Availability (UC8)</button>
      </div>

      {activeTab === "bookings" && (
  <div>
    <h3>Incoming Client Requests & Active Bookings</h3>
    {bookings.length === 0 ? (
      <p style={{ color: "#636e72" }}>No bookings found for your ID.</p>
    ) : (
      bookings.map(b => (
        <div key={b.id} style={{ border: "1px solid #b2bec3", padding: "15px", marginBottom: "15px", borderRadius: "8px", background: "#fdfdfd" }}>
          {/* Fallback to 'Consulting Session' if Java doesn't send the string */}
          <p><strong>Service:</strong> {b.serviceType || "Expert Consulting Session"}</p>
          <p><strong>Booking ID:</strong> #{b.id} | <strong>Price:</strong> ${b.basePrice || b.base_price}</p>
          <p><strong>Status:</strong> <span style={{ color: "#d63031", fontWeight: "bold" }}>{b.state}</span></p>
          
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            {b.state === "REQUESTED" && (
              <>
                <button onClick={() => handleAccept(b.id)} style={{ padding: "8px 16px", background: "#00b894", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Accept Request</button>
                <button onClick={() => handleReject(b.id)} style={{ padding: "8px 16px", background: "#d63031", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Reject</button>
              </>
            )}
            {(b.state === "PAID" || b.state === "CONFIRMED" || b.state === "APPROVED") && (
              <button onClick={() => handleComplete(b.id)} style={{ padding: "8px 16px", background: "#0984e3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Mark as Completed</button>
            )}
          </div>
        </div>
      ))
    )}
  </div>
)}

      {activeTab === "availability" && (
        <div>
          <h3>Manage Your Availability Slots</h3>
          <form onSubmit={handleAddSlot} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input type="datetime-local" required onChange={e => setNewSlot({...newSlot, start: e.target.value})} style={{ padding: "8px" }} />
            <input type="datetime-local" required onChange={e => setNewSlot({...newSlot, end: e.target.value})} style={{ padding: "8px" }} />
            <button type="submit" style={{ padding: "8px 16px", background: "#0984e3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Add Slot</button>
          </form>
          
          {availabilities.map(a => (
            <div key={a.id} style={{ border: "1px solid #b2bec3", padding: "10px", marginBottom: "10px", borderRadius: "4px" }}>
              <p><strong>Slot:</strong> {a.start} to {a.end}</p>
              <p><strong>Status:</strong> {a.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultantDashboard;