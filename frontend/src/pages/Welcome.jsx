import React from "react";

function Welcome() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(to right, #007bff, #6610f2)",
        color: "white",
        padding: "20px",
      }}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ width: "100%", backgroundColor: "transparent" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="/" style={{ fontSize: "24px" }}>
            🎓 Student Portal
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="text-center"
        style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "20px" }}>
          Welcome to the Student & Admin Portal
        </h1>
        <p
          className="lead"
          style={{ maxWidth: "700px", margin: "0 auto 30px auto", fontSize: "18px", color: "#f8f9fa" }}
        >
          Connect with peers, join study groups, organize fundraisers, and collaborate in one
          platform. Admins ensure a safe, smooth, and engaging environment for everyone.
        </p>
        <div>
          <a
            href="/signup"
            className="btn btn-success btn-lg me-3"
            style={{ borderRadius: "30px", padding: "12px 30px", fontSize: "18px" }}
          >
            Get Started
          </a>
          <a
            href="/login"
            className="btn btn-outline-light btn-lg"
            style={{ borderRadius: "30px", padding: "12px 30px", fontSize: "18px" }}
          >
            Already a Member? Login
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center" style={{ padding: "15px 0", color: "#ddd", fontSize: "14px" }}>
        © {new Date().getFullYear()} Student Portal | All rights reserved
      </footer>
    </div>
  );
}

export default Welcome;
