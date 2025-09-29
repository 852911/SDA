import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setNotifications(data.notifications.reverse());
        else console.error(data.message);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  const showPopup = (msg, type = "success") => {
    setPopup({ message: msg, type });
    setTimeout(() => setPopup(null), 3000); // auto hide after 3s
  };

  const handleDeleteAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/users/notifications/delete-all-notifications",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setNotifications([]);
        showPopup(data.message, "success");
      } else {
        showPopup(data.error || "Failed to delete", "error");
      }
    } catch (err) {
      console.error("Error deleting notifications:", err);
      showPopup("Something went wrong", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/users/notifications/mark-all-as-read",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications.reverse());
        showPopup(data.message, "success");
      } else {
        showPopup(data.error || "Failed to mark all as read", "error");
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
      showPopup("Something went wrong", "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f9f9f9" }}>

      {/* ✅ Popup */}
      {popup && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px 20px",
            borderRadius: "8px",
            color: "white",
            background:
              popup.type === "success"
                ? "linear-gradient(90deg,#28a745,#218838)"
                : "linear-gradient(90deg,#dc3545,#c82333)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: "220px",
          }}
        >
          <span>{popup.message}</span>
          <button
            onClick={() => setPopup(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontWeight: "bold",
              marginLeft: "10px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ✖
          </button>
        </div>
      )}

      <main style={{ flexGrow: 1, padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h2
            style={{
              color: "#6610f2",
              borderBottom: "2px solid #007bff",
              paddingBottom: "5px",
              fontWeight: "700",
            }}
          >
            All Notifications
          </h2>
          {notifications.length > 0 && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  background: "linear-gradient(90deg, #17a2b8, #138496)",
                  border: "none",
                  padding: "8px 16px",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "6px",
                  cursor: "pointer",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = "linear-gradient(90deg,#138496,#17a2b8)")
                }
                onMouseOut={(e) =>
                  (e.target.style.background = "linear-gradient(90deg,#17a2b8,#138496)")
                }
              >
                Mark All as Read
              </button>

              <button
                onClick={handleDeleteAll}
                style={{
                  background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
                  border: "none",
                  padding: "8px 16px",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "6px",
                  cursor: "pointer",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = "linear-gradient(90deg,#ff4b2b,#ff416c)")
                }
                onMouseOut={(e) =>
                  (e.target.style.background = "linear-gradient(90deg,#ff416c,#ff4b2b)")
                }
              >
                Delete All
              </button>
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "1rem", color: "#555" }}>
            No notifications available.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {notifications.map((notif) => {
              const message = notif.message || "";
              const date = notif.date ? new Date(notif.date).toLocaleString() : "";
              const status = notif.isRead ? "Read" : "Unread";
              const shortMsg = message.length > 50 ? message.substring(0, 50) + "..." : message;

              return (
                <div
                  key={notif._id}
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
                  onClick={() => navigate(`/notification/${notif._id}`)}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginRight: "10px",
                    }}
                  >
                    {shortMsg}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#555", flexShrink: 0 }}>{date}</span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;
