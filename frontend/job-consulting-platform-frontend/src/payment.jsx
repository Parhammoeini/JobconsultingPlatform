import React, { useState } from "react";
import { processPayment } from "./api";

const PaymentSection = ({ selectedService, onClose }) => {
  // State matches your PaymentRequest.java fields exactly
  const [paymentData, setPaymentData] = useState({
    type: "CREDIT_CARD", // Default Strategy
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    email: "",
    accountNumber: "",
    routingNumber: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Sends the DTO to PaymentController
      const response = await processPayment(paymentData);
      setMessage("✅ Payment Successful! Strategy used: " + paymentData.type);
      setTimeout(() => onClose(), 2000); // Close modal after success
    } catch (err) {
      setMessage("❌ Payment Failed. Check Strategy Factory logic.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <h3>Complete Booking: {selectedService.service_type}</h3>
      <p>Amount to Pay: <strong>${selectedService.base_price}</strong></p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        
        <label>Select Payment Method (Strategy Pattern):</label>
        <select 
          value={paymentData.type} 
          onChange={(e) => setPaymentData({ ...paymentData, type: e.target.value })}
          style={{ padding: "8px" }}
        >
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="DEBIT_CARD">Debit Card</option>
          <option value="PAYPAL">PayPal</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
        </select>

        {/* Dynamic Fields based on Strategy Type */}
        {(paymentData.type === "CREDIT_CARD" || paymentData.type === "DEBIT_CARD") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <input type="text" placeholder="Card Number" required onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})} />
            <div style={{ display: "flex", gap: "5px" }}>
              <input type="text" placeholder="MM/YY" required onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})} />
              <input type="text" placeholder="CVV" required onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})} />
            </div>
          </div>
        )}

        {paymentData.type === "PAYPAL" && (
          <input type="email" placeholder="PayPal Email" required onChange={(e) => setPaymentData({...paymentData, email: e.target.value})} />
        )}

        {paymentData.type === "BANK_TRANSFER" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <input type="text" placeholder="Account Number" required onChange={(e) => setPaymentData({...paymentData, accountNumber: e.target.value})} />
            <input type="text" placeholder="Routing Number" required onChange={(e) => setPaymentData({...paymentData, routingNumber: e.target.value})} />
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: "12px", background: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          {loading ? "Processing..." : `Pay $${selectedService.base_price}`}
        </button>
      </form>

      {message && <p style={{ marginTop: "15px", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
};

export default PaymentSection;