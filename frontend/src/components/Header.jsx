import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("fundraisers");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const bellRef = useRef(null);
  const profileRef = useRef(null);

  const menuItems = [
    { id: "fundraisers", label: "Fundraisers", path: "/fundraisers" },
    { id: "lost-found", label: "Lost & Found", path: "/lost-found" },
    { id: "study-groups", label: "Study Groups", path: "/study-groups" },
    { id: "resources", label: "Resources", path: "/resources" },
  ];

  const handleTabClick = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleBellClick = async () => {
    setShowDropdown(!showDropdown);
    setShowProfileDropdown(false);

    if (!showDropdown) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setNotifications(data.notifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    }
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (bellRef.current && !bellRef.current.contains(event.target)) &&
        (profileRef.current && !profileRef.current.contains(event.target))
      ) {
        setShowDropdown(false);
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recentNotifs = [...notifications].slice(-3).reverse();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 30px",
        background: "linear-gradient(to right, #007bff, #6610f2)",
        color: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        flexWrap: "wrap",
      }}
    >
      {/* Logo / Title */}
      <h3
        style={{ margin: 0, fontWeight: "700", fontSize: "1.8rem", cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        Student Portal
      </h3>

      {/* Tabs Menu */}
      <nav style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleTabClick(item)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: activeTab === item.id ? "rgba(255,255,255,0.2)" : "transparent",
              color: "#fff",
              fontWeight: activeTab === item.id ? "600" : "500",
              transition: "0.2s",
            }}
          >
            {item.label}
          </div>
        ))}
      </nav>

      {/* Icons: Notifications + Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
        {/* Bell */}
        <div ref={bellRef} style={{ position: "relative" }}>
          <FaBell style={{ fontSize: "1.5rem", cursor: "pointer" }} onClick={handleBellClick} />
          {notifications.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-10px",
                background: "red",
                color: "#fff",
                borderRadius: "50%",
                fontSize: "0.75rem",
                padding: "2px 6px",
                fontWeight: "700",
              }}
            >
              {notifications.length}
            </span>
          )}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: 0,
                background: "#fff",
                color: "#000",
                borderRadius: "10px",
                width: "220px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                zIndex: 1001,
                overflow: "hidden",
              }}
            >
              {recentNotifs.length === 0 ? (
                <div style={{ padding: "10px", fontSize: "0.9rem" }}>No notifications</div>
              ) : (
                <>
                  {recentNotifs.map((notif) => {
                    const message = notif.message || "";
                    const date = notif.date ? new Date(notif.date).toLocaleString() : "";
                    const status = notif.isRead ? "Read" : "Unread";
                    const shortMsg = message.length > 50 ? message.substring(0, 50) + "..." : message;
                    return (
                      <div
                        key={notif._id}
                        onClick={() => { navigate(`/notification/${notif._id}`); setShowDropdown(false); }}
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          background: status === "Unread" ? "#e9e9e9" : "#fff",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          overflow: "hidden",
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "10px" }}>
                          {shortMsg}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "#555", flexShrink: 0 }}>{date}</span>
                      </div>
                    );
                  })}
                  <div
                    onClick={() => { navigate("/notifications"); setShowDropdown(false); }}
                    style={{ padding: "10px", textAlign: "center", fontWeight: "600", cursor: "pointer", color: "#007bff" }}
                  >
                    View All
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <FaUserCircle
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={handleProfileClick}
          />
          {showProfileDropdown && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: 0,
                background: "#fff",
                color: "#000",
                borderRadius: "10px",
                width: "150px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                zIndex: 1001,
              }}
            >
              <div onClick={() => { navigate("/profile"); setShowProfileDropdown(false); }} style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}>Profile</div>
              <div onClick={() => { navigate("/settings"); setShowProfileDropdown(false); }} style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}>Settings</div>
              <div onClick={handleLogout} style={{ padding: "10px", cursor: "pointer", color: "red" }}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
