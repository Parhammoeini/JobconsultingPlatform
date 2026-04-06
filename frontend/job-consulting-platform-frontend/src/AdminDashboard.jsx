import { useState } from "react";
import ConsultantApproval from "./ConsultantApproval";
import SystemStatus from "./SystemStatus";
import PolicyManager from "./PolicyManager";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("status");

  const tabs = [
    { key: "status", label: "📊 System Status" },
    { key: "approvals", label: "✅ Consultant Approvals" },
    { key: "policies", label: "⚙️ System Policies" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Manage your platform from one place</p>
      </div>

      <div style={styles.tabBar}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...styles.tabBtn,
              ...(activeTab === tab.key ? styles.tabBtnActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.card}>
        {activeTab === "status" && <SystemStatus />}
        {activeTab === "approvals" && <ConsultantApproval />}
        {activeTab === "policies" && <PolicyManager />}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "sans-serif",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2d3436",
    margin: 0,
  },
  subtitle: {
    color: "#636e72",
    marginTop: "6px",
  },
  tabBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
  },
  tabBtn: {
    padding: "10px 20px",
    border: "2px solid #dfe6e9",
    borderRadius: "8px",
    background: "white",
    color: "#636e72",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  tabBtnActive: {
    background: "#0984e3",
    color: "white",
    borderColor: "#0984e3",
  },
  card: {
    background: "white",
    borderRadius: "15px",
    padding: "35px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
  },
};

export default AdminDashboard;
