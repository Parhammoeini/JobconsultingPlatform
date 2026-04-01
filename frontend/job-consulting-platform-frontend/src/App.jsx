import React, { useState } from "react";
import Availability from "./Availability";
import Booking from "./Booking";
import { suggestServices } from "./api"; // Importing your Axios helper

function App() {
  const [profile, setProfile] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const handleAiConsult = async () => {
    setAiResponse("Thinking...");
    try {
      const res = await suggestServices(profile);
      setAiResponse(res.data);
    } catch (err) {
      setAiResponse("Error connecting to AI service.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Consultant Dashboard</h1>
      
      {/* Teammate's Features */}
      <Availability />
      <hr />
      <Booking />
      
      <hr />

      {/* Your AI Feature */}
      <section style={{ marginTop: "40px", backgroundColor: "#f4f4f4", padding: "20px" }}>
        <h2>AI Career Consultant (Phase 2)</h2>
        <textarea 
          value={profile} 
          onChange={(e) => setProfile(e.target.value)}
          placeholder="e.g. 3rd year York student interested in kernels"
          style={{ width: "100%", height: "100px" }}
        />
        <br />
        <button onClick={handleAiConsult} style={{ marginTop: "10px", padding: "10px 20px", cursor: "pointer" }}>
          Get Expert Recommendations
        </button>
        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap", fontStyle: "italic" }}>
          {aiResponse}
        </div>
      </section>
    </div>
  );
}

export default App;