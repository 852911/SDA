import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const IndNotification = () => {
  const { id } = useParams(); // get notificationId from URL
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");

  // 1. Fetch notification details
  axios.get(`http://localhost:5000/api/users/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => setNotification(res.data.notification)) // check backend response format
    .catch(err => console.error(err));

  // 2. Mark notification as read
  axios.post(`http://localhost:5000/api/users/notifications/${id}/mark-read`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .catch(err => console.error("Error marking as read:", err));
}, [id]);

const handleDelete = () => {
  const token = localStorage.getItem("token");
  axios.delete(`http://localhost:5000/api/users/notifications/${id}/delete-notification`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(() => navigate("/notifications"))
    .catch(err => console.error(err));
};


  if (!notification) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{notification.title}</h2>
      <p>{notification.message}</p>
      <p><b>Date:</b> {new Date(notification.date).toLocaleString()}</p>
      <button onClick={handleDelete} style={{ marginRight: "10px" }}>
        Delete Notification
      </button>
      <button onClick={() => navigate("/notifications")}>
        Back to All
      </button>
    </div>
  );
};

export default IndNotification;
