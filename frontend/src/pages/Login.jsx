// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Store token or user info
        if (data.token) localStorage.setItem("token", data.token);
        else localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to home page
        navigate("/home");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ Something went wrong!");
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to right, #007bff, #6610f2)",
    padding: "20px",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "15px",
    padding: "40px 30px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  };

  const inputStyle = {
    borderRadius: "8px",
    padding: "10px",
  };

  const buttonStyle = {
    borderRadius: "8px",
    padding: "10px",
    fontWeight: "bold",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "30px",
    color: "#007bff",
    fontWeight: "700",
  };

  return (
    <div style={pageStyle}>
      <form
        onSubmit={handleSubmit}
        style={cardStyle}
        className="d-flex flex-column gap-3"
      >
        <h2 style={titleStyle}>Login</h2>
        {message && (
          <div className="alert alert-info text-center">{message}</div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <button type="submit" style={buttonStyle} className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
