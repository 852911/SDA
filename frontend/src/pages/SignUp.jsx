// src/pages/SignUp.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    rollNo: "",
    campus: "",
    degree: "",
    batch: "",
    password: "",
  });

  const [campuses, setCampuses] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCampuses = async () => {
      const res = await fetch("http://localhost:5000/api/campus");
      const data = await res.json();
      setCampuses(data);
    };

    const fetchDegrees = async () => {
      const res = await fetch("http://localhost:5000/api/degree");
      const data = await res.json();
      setDegrees(data);
    };

    fetchCampuses();
    fetchDegrees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/students/signup", {
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
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    transition: "transform 0.3s",
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
        <h2 style={titleStyle}>Create Your Account</h2>
        {message && (
          <div className="alert alert-info text-center">{message}</div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
          required
        />

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
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <input
          type="text"
          name="rollNo"
          placeholder="Roll No"
          value={formData.rollNo}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <select
          name="campus"
          value={formData.campus}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">Select Campus</option>
          {campuses.map((campus) => (
            <option key={campus._id} value={campus._id}>
              {campus.name}
            </option>
          ))}
        </select>

        <select
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">Select Degree</option>
          {degrees.map((degree) => (
            <option key={degree._id} value={degree._id}>
              {degree.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="batch"
          placeholder="Batch"
          value={formData.batch}
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
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
