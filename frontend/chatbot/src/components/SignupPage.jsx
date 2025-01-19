import React, { useState } from "react";
import "./Auth.css"; // Ensure to create and include this CSS file
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/Login");
        console.log(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNavigate = () => {
    navigate("/Login"); // Navigate to the signup route
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="auth-button">
          Sign Up
        </button>
        <div style={{ marginTop: 10 }}>
          Already registered?{" "}
          <button
            type="button" // Specify type="button" to prevent form submission
            style={{
              color: "#037bfc",
              backgroundColor: "#333",
              border: "0px #333 solid",
              cursor: "pointer",
            }}
            onClick={handleNavigate} // Call handleNavigate
          >
            Login
          </button>{" "}
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
