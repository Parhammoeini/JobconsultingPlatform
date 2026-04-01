import { useEffect, useState } from "react";
import API from "./api";

export default function ConsultantApproval() {
  const [pendingConsultants, setPendingConsultants] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await API.get("/admin/consultants/pending");
      setPendingConsultants(res.data);
    } catch (err) {
      setMessage("Error fetching consultants");
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/consultants/${id}/approve`);
      setPendingConsultants(prev => prev.filter(c => c.id !== id));
      setMessage("Consultant approved");
    } catch {
      setMessage("Error approving consultant");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/admin/consultants/${id}/reject`);
      setPendingConsultants(prev => prev.filter(c => c.id !== id));
      setMessage("Consultant rejected");
    } catch {
      setMessage("Error rejecting consultant");
    }
  };

  return (
    <div>
      <h2>Pending Consultants</h2>
      {message && <p>{message}</p>}

      {pendingConsultants.length === 0 ? (
        <p>No pending consultants</p>
      ) : (
        pendingConsultants.map((c) => (
          <div key={c.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
            <p><strong>Name:</strong> {c.name}</p>
            <p><strong>Email:</strong> {c.email}</p>
            <p><strong>Specialty:</strong> {c.specialty}</p>

            <button onClick={() => handleApprove(c.id)}>Approve</button>
            <button onClick={() => handleReject(c.id)}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
}
