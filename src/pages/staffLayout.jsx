import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

function staffLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("staffUser");
    navigate("/");
  };

  return (
    <div className="staff-page">

      {/* ================= HEADER ================= */}
      <header className="header">

        <div className="header-left">

          <img
            src="/logo.webp.png"
            alt="School Logo"
            className="school-logo"
          />

          <div>
            <h3 className="mb-1">
              Millennium Kidss Nagpur
            </h3>

            <p className="school-subtitle">
              Plot No 4, near Trimurti Nagar, beside Bharat Gas Office,
              Surve Nagar, Nagpur, Maharashtra
              <br />
              📞 8600031558
            </p>
          </div>

        </div>


        <button
          onClick={handleLogout}
          style={{
            background: "white",
            color: "#1E40AF",
            border: "none",
            padding: "9px 18px",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Logout
        </button>

      </header>


      {/* ================= PAGE CONTENT ================= */}

      <main className="staff-content">

        <Outlet />

      </main>

    </div>
  );
}

export default staffLayout;