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
            <p><strong>Specialty:</strong> {c.specialization}</p>
            <p><strong>Location:</strong> {c.location || <span style={{color: "gray", fontSize: "0.9em"}}>Not specified</span>}</p>
            <p><strong>Education:</strong> {c.education || <span style={{color: "gray", fontSize: "0.9em"}}>Not specified</span>}</p>
            <p><strong>Bio:</strong> {c.bio || <span style={{color: "gray", fontSize: "0.9em"}}>Not specified</span>}</p>
            
            <div style={{ marginTop: "10px" }}>
              <strong>Experience:</strong>
              {(!c.experiences || c.experiences === '[]' || c.experiences === 'null') ? (
                <p style={{ margin: "5px 0", color: "gray", fontSize: "0.9em" }}>No experience listed.</p>
              ) : (
                <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                  {(() => {
                    try {
                      const exps = JSON.parse(c.experiences);
                      if (!Array.isArray(exps) || exps.length === 0) {
                        return <li style={{color: "gray", fontSize: "0.9em"}}>No experience listed.</li>;
                      }
                      return exps.map((exp, i) => (
                        <li key={i} style={{ marginBottom: "5px" }}>
                          <strong>{exp.title}</strong> - {exp.duration}
                          <div style={{ fontSize: "0.9em", color: "#636e72" }}>{exp.description}</div>
                        </li>
                      ));
                    } catch(e) {
                      return <li>{c.experiences}</li>;
                    }
                  })()}
                </ul>
              )}
            </div>

            <div style={{ marginTop: "15px" }}>
              <button onClick={() => handleApprove(c.id)} style={{ marginRight: "10px" }}>Approve</button>
              <button onClick={() => handleReject(c.id)}>Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}