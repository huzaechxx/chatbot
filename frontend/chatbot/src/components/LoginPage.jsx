import React, { useState } from "react";
import "./Auth.css"; // Ensure to create and include this CSS file
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
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
  const extractUsername = (email) => {
    // Split the email at '@' and take the first part
    const username = email.split("@")[0];
    return username;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://chat-bot-backend-n4g50zvur-huzaifa-zahids-projects.vercel.app/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData), // Ensure formData includes email and password
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        const user = extractUsername(formData.email);
        localStorage.setItem("user", user);
        localStorage.setItem("token", data.token); // Save token to localStorage
        navigate("/bot");
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.log("hello");

      console.error("Error logging in:", error);
    }
  };

  const handleNavigate = () => {
    navigate("/Signup"); // Navigate to the signup route
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          name="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit" className="auth-button">
          Login
        </button>
        <div style={{ marginTop: 10 }}>
          Not registered?{" "}
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
            Create Account
          </button>{" "}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
