import React from "react";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  // const API_URL = import.meta.env.VITE_API_URL;
  const staffUser = JSON.parse(localStorage.getItem("staffUser") || "{}");
  const displayName = staffUser.name || staffUser.username || "Staff";
  const branches = staffUser.branches || [];

  const branchNames = branches
    .map((branch) => (typeof branch === "string" ? branch : branch.branchName))
    .filter(Boolean);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("staffUser");
    // window.location.replace("/stafflogin");
    navigate("/stafflogin", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: "url('/back.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}

      <div className="main-content">
        {/* Header */}
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
              Nagar, Nagpur, Maharashtra <br />
              📞 8600031558{" "}
            </p>
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
          {/* </div> */}
        </header>
        {/* </div> */}
      </div>

      {/* Main Content */}
      <div
        style={{
          padding: "35px",
        }}
      >
        <div className="container-fluid">
          {/* Welcome */}
          <div className="mb-4">
            <h3 className="fw-bold">Welcome, {displayName} 👋</h3>

            <p className="mb-2">
              <strong>Branch:</strong>{" "}
              {branchNames.length > 0
                ? branchNames.join(" || ")
                : "No branch assigned"}
            </p>

            <p className="text-muted">
              Manage students, payments and daycare admissions.
            </p>
          </div>

          {/* Action Cards */}
          <div className="row g-4">
            {/* Add Student */}
            <div className="col-md-4">
              <div
                className="card h-100 bg-light border border-primary shadow-sm"
                style={{
                  borderRadius: "18px",
                }}
              >
                <div className="card-body text-center p-4">
                  <div
                    style={{
                      fontSize: "45px",
                      marginBottom: "15px",
                    }}
                  >
                    👨‍🎓
                  </div>

                  <h4 className="fw-bold">Add Student</h4>

                  <p className="text-muted">
                    Register a new preschool student.
                  </p>

                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate("/staff/students")}
                  >
                    Add Student
                  </button>
                </div>
              </div>
            </div>

            {/* Add Payment */}
            <div className="col-md-4">
              <div
                className="card h-100 bg-light border border-success shadow-sm"
                style={{
                  borderRadius: "18px",
                }}
              >
                <div className="card-body text-center p-4">
                  <div
                    style={{
                      fontSize: "45px",
                      marginBottom: "15px",
                    }}
                  >
                    💰
                  </div>

                  <h4 className="fw-bold">Add Payment</h4>

                  <p className="text-muted">Record student fee payments.</p>

                  <button
                    className="btn btn-success w-100"
                    onClick={() => navigate("/staff/payments")}
                  >
                    Add Payment
                  </button>
                </div>
              </div>
            </div>

            {/* Add Daycare Student */}
            <div className="col-md-4">
              <div
                className="card h-100 bg-light border border-warning shadow-sm"
                style={{
                  borderRadius: "18px",
                }}
              >
                <div className="card-body text-center p-4">
                  <div
                    style={{
                      fontSize: "45px",
                      marginBottom: "15px",
                    }}
                  >
                    🧸
                  </div>

                  <h4 className="fw-bold">Add Daycare Student</h4>

                  <p className="text-muted">Register a new daycare student.</p>

                  <button
                    className="btn btn-warning w-100"
                    onClick={() => navigate("/staff/daycare")}
                  >
                    Add Daycare Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
