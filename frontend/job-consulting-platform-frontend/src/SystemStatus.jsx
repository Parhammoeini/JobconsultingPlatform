import { useEffect, useState } from "react";
import API from "./api";

function SystemStatus() {
  const [stats, setStats] = useState({
    totalConsultants: 0,
    pendingApprovals: 0,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await API.get("/api/admin/status"); 
      setStats(res.data);
    } catch (err) {
      setMessage("Error fetching system status");
    }
  };

  return (
    <div>
      <h2>System Status</h2>

      {message && <p>{message}</p>}

      <p><strong>Total Consultants:</strong> {stats.totalConsultants}</p>
      <p><strong>Pending Approvals:</strong> {stats.pendingApprovals}</p>

      <button onClick={fetchStatus}>Refresh</button>
    </div>
  );
}

export default SystemStatus;
