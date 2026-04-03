import { useEffect, useState } from "react";
import { getSystemStatus } from "./api";

function SystemStatus() {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await getSystemStatus();
      setStats(res.data);
      setMessage("");
    } catch {
      setMessage("Error fetching system status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ color: "#636e72" }}>Loading...</p>;

  return (
    <div>
      <div style={styles.topRow}>
        <h2 style={styles.heading}>System Status</h2>
        <button onClick={fetchStatus} style={styles.refreshBtn}>🔄 Refresh</button>
      </div>

      {message && <p style={styles.error}>{message}</p>}

      {stats && (
        <div style={styles.grid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Consultants</p>
            <p style={styles.statValue}>{stats.totalConsultants ?? "-"}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Pending Approvals</p>
            <p style={styles.statValue}>{stats.pendingApprovals ?? "-"}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Bookings</p>
            <p style={styles.statValue}>{stats.totalBookings ?? "-"}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Clients</p>
            <p style={styles.statValue}>{stats.totalClients ?? "-"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  heading: { margin: 0, color: "#2d3436" },
  refreshBtn: { padding: "8px 16px", background: "#f1f2f6", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "500" },
  error: { color: "#d63031", background: "#fff5f5", padding: "10px", borderRadius: "8px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  statCard: { background: "#f9f9f9", borderRadius: "10px", padding: "20px", textAlign: "center" },
  statLabel: { color: "#636e72", margin: "0 0 8px 0", fontSize: "13px", textTransform: "uppercase" },
  statValue: { color: "#2d3436", fontSize: "32px", fontWeight: "bold", margin: 0 },
};

export default SystemStatus;
