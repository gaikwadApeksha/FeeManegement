import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function adminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("adminUser");

    navigate("/", { replace: true });
  };
  return (
    <div className="app-layout">
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰<span>Fee Management</span>
      </button>

      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : " "}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">Fee Management</h3>

          {/* Close button only on mobile */}

          <button className="sidebar-close" onClick={() => setMenuOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="nav flex-column">
          <Link
            className="nav-link"
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
          >
            📊 Dashboard
          </Link>

          <Link
            className="nav-link"
            to="/students"
            onClick={() => setMenuOpen(false)}
          >
            👨‍🎓 Students
          </Link>

          <Link
            className="nav-link"
            to="/daycare"
            onClick={() => setMenuOpen(false)}
          >
            🏫 Daycare
          </Link>

          <Link
            className="nav-link"
            to="/payments"
            onClick={() => setMenuOpen(false)}
          >
            💰 Fee Payment
          </Link>

          <Link
            className="nav-link"
            to="/reports"
            onClick={() => setMenuOpen(false)}
          >
            📄 Reports
          </Link>
        </nav>
      </aside>

      {/* ================= OVERLAY ================= */}

      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="main-content">
        {/* ================= HEADER ================= */}
        <header className="header">
          <div className="header-left">
            <img
              src="/logo.webp.png"
              alt="School Logo"
              className="school-logo"
            />
          </div>

          <div>
            <h2 className="school-name">
              <span style={{ color: "#FF0000" }}>M</span>
              <span style={{ color: "#FF7F00" }}>i</span>
              <span style={{ color: "#FFD700" }}>l</span>
              <span style={{ color: "#32CD32" }}>l</span>
              <span style={{ color: "#00BFFF" }}>e</span>
              <span style={{ color: "#8A2BE2" }}>n</span>
              <span style={{ color: "#FF1493" }}>n</span>
              <span style={{ color: "#FF4500" }}>i</span>
              <span style={{ color: "#1E90FF" }}>u</span>
              <span style={{ color: "#32CD32" }}>m</span>

              <span style={{ color: "#FF0000" }}> K</span>
              <span style={{ color: "#FF7F00" }}>i</span>
              <span style={{ color: "#FFD700" }}>d</span>
              <span style={{ color: "#32CD32" }}>s</span>
              <span style={{ color: "#00BFFF" }}>s</span>

              <span style={{ color: "#FF1493" }}> N</span>
              <span style={{ color: "#FF4500" }}>a</span>
              <span style={{ color: "#1E90FF" }}>g</span>
              <span style={{ color: "#32CD32" }}>p</span>
              <span style={{ color: "#8A2BE2" }}>u</span>
              <span style={{ color: "#FF1493" }}>r</span>
            </h2>

            <p className="school-subtitle">
              Plot No 4, near Trimurti Nagar, beside Bharat Gas Office, Surve
              Nagar, Nagpur, Maharashtra
              <br />
              📞 8600031558
            </p>
          </div>

          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}

        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}

export default adminLayout;
