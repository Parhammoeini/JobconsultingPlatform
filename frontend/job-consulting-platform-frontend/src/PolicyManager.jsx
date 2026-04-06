import { useEffect, useState } from "react";
import API from "./api";

export default function PolicyManager() {
  const [policies, setPolicies] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await API.get("/admin/policies");

      // Convert array → object
      const obj = {};
      res.data.forEach(p => {
        obj[p.policyName] = p.policyValue;
      });

      setPolicies(obj);
    } catch {
      setMessage("Error loading policies");
    }
  };

  const handleChange = (field, value) => {
    setPolicies({ ...policies, [field]: value });
  };

  const savePolicy = async (name, value) => {
    try {
      await API.post("/admin/policies", {
        policyName: name,
        policyValue: String(value),
        description: name
      });
    } catch {
      setMessage(`Error saving ${name}`);
    }
  };

  const handleSaveAll = async () => {
    for (const key in policies) {
      await savePolicy(key, policies[key]);
    }
    setMessage("Policies saved successfully");
  };

  return (
    <div>
      <h2>System Policies</h2>
      {message && <p>{message}</p>}

      <div>
        <label>Cancellation Window (Hours): </label>
        <input
          type="number"
          value={policies.cancellationWindowHours || ""}
          onChange={(e) => handleChange("cancellationWindowHours", e.target.value)}
        />
      </div>

      <div>
        <label>Refund Percentage: </label>
        <input
          type="number"
          value={policies.refundPercentage || ""}
          onChange={(e) => handleChange("refundPercentage", e.target.value)}
        />
      </div>

      <div>
        <label>Base Price: </label>
        <input
          type="number"
          value={policies.basePrice || ""}
          onChange={(e) => handleChange("basePrice", e.target.value)}
        />
      </div>

      <div>
        <label>Notifications Enabled: </label>
        <input
          type="checkbox"
          checked={policies.notificationsEnabled === "true"}
          onChange={(e) => handleChange("notificationsEnabled", e.target.checked)}
        />
      </div>

      <button onClick={handleSaveAll}>Save Policies</button>
    </div>
  );
}
