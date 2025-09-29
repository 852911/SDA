import React, { useEffect, useState } from "react";


function Home() {
  const [student, setStudent] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("student"));
    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setStudent(storedStudent);
    setNotifications(storedNotifications);
  }, []);

  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "linear-gradient(to right, #007bff, #6610f2)",
    padding: "0",
  };




  return (
    <div style={pageStyle}>
      
    </div>
  );
}

export default Home;
