import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import IndNotification from "./pages/IndNotification";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import FundRaiser from "./pages/FundRaiser";
import LostAndFound from "./pages/LostAndFound";
import Resources from "./pages/Resources";
import StudyGroups from "./pages/STudyGroups";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Layout component for protected pages
function MainLayout({ children }) {
  return (
    <>
      <Header />
      <div style={{ marginTop: "56px", minHeight: "calc(100vh - 56px - 60px)" }}>
        {children}
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected pages */}
        <Route
          path="/home"
          element={<MainLayout><Home /></MainLayout>}
        />
        <Route
          path="/notifications"
          element={<MainLayout><Notifications /></MainLayout>}
        />
        <Route
          path="/notification/:id"
          element={<MainLayout><IndNotification /></MainLayout>}
        />
        <Route
          path="/profile"
          element={<MainLayout><Profile /></MainLayout>}
        />
        <Route
          path="/dashboard"
          element={<MainLayout><Dashboard /></MainLayout>}
        />
        <Route
          path="/fundraisers"
          element={<MainLayout><FundRaiser /></MainLayout>}
        />
        <Route
          path="/lost-found"
          element={<MainLayout><LostAndFound /></MainLayout>}
        />
        <Route
          path="/community"
          element={<MainLayout><Community /></MainLayout>}
        />
        <Route
          path="/study-groups"
          element={<MainLayout><StudyGroups /></MainLayout>}
        />
        <Route
          path="/resources"
          element={<MainLayout><Resources /></MainLayout>}
        />
      </Routes>
    </Router>
  );
}

export default App;
