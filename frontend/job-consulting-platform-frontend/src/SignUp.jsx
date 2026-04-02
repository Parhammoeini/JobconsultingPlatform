import React, { useState } from "react";
import { signupUser } from "./api"; // We will add this function next

function SignUp() {
  const [formData, setFormData] = useState({ username: "", password: "", role: "CLIENT" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signupUser(formData);
      alert("Sign up successful! You can now log in.");
    } catch (error) {
      alert("Sign up failed. Check the console.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="Username" 
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
        /><br/>
        <input 
          type="password" placeholder="Password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        /><br/>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;