import React from "react";

function Footer({ darkMode }) {
  return (
    <footer
      className={`text-center py-3 mt-auto ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
      style={{ borderTop: "1px solid", borderColor: darkMode ? "#444" : "#ccc" }}
    >
      &copy; {new Date().getFullYear()} Student Portal. All rights reserved.
    </footer>
  );
}

export default Footer;
