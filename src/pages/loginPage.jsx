import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function loginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    // Admin credentials
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          username: username.trim(),
          password: password,
        },
      );
      console.log("LOGIN RESPONSE:", response.data);
      if (response.data.role !== "ADMIN") {
        setError("You do not have admin access.");
        return;
      }

      localStorage.setItem("adminUser", JSON.stringify(response.data));

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("BACKEND RESPONSE:", error.response.data);
      }
      setError("Invalid staff username or password");
    }
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        padding: "20px",
      }}
    >
      {/* Background Blur */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.20)",
          backdropFilter: "blur(7px)",
        }}
      />

      {/* ADMIN LOGIN BOX */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "430px",
          background: "rgba(255, 255, 255, 0.96)",
          borderRadius: "24px",
          padding: "35px 40px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.30)",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center" }}>
          <img
            src="/logo.webp.png"
            alt="Millennium Kidss"
            style={{
              width: "150px",
              height: "auto",
              marginBottom: "15px",
            }}
          />

          {/* School Name */}
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "800",
              margin: "0 0 15px",
              lineHeight: "1.2",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#ff0000" }}>M</span>
            <span style={{ color: "#ff7f00" }}>i</span>
            <span style={{ color: "#ffd700" }}>l</span>
            <span style={{ color: "#32cd32" }}>l</span>
            <span style={{ color: "#00bfff" }}>e</span>
            <span style={{ color: "#8a2be2" }}>n</span>
            <span style={{ color: "#ff1493" }}>n</span>
            <span style={{ color: "#ff4500" }}>i</span>
            <span style={{ color: "#1e90ff" }}>u</span>
            <span style={{ color: "#32cd32" }}>m</span>{" "}
            <span style={{ color: "#ff0000" }}>K</span>
            <span style={{ color: "#ff7f00" }}>i</span>
            <span style={{ color: "#ffd700" }}>d</span>
            <span style={{ color: "#32cd32" }}>s</span>
            <span style={{ color: "#00bfff" }}>s</span>{" "}
            <span style={{ color: "#ff1493" }}>Nagpur</span>
          </h1>

          {/* Admin Title */}
          <h3
            style={{
              color: "#168b55",
              fontSize: "25px",
              fontWeight: "700",
              marginBottom: "28px",
            }}
          >
            Admin Login
          </h3>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Username */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#333",
              }}
            >
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 15px",
                borderRadius: "12px",
                border: "1px solid #d5d5d5",
                background: "#f5f8ff",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#333",
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 15px",
                borderRadius: "12px",
                border: "1px solid #d5d5d5",
                background: "#f5f8ff",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#ffe5e5",
                color: "#d00000",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "15px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb, #1e40af)",
              color: "white",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 6px 15px rgba(37,99,235,0.3)",
            }}
          >
            Login
          </button>

          {/* Staff Login */}
          <div
            style={{
              marginTop: "22px",
              paddingTop: "18px",
              borderTop: "1px solid #ddd",
              textAlign: "center",
              color: "#777",
              fontSize: "14px",
            }}
          >
            Are you a staff member?{" "}
            <Link
              to="/stafflogin"
              style={{
                color: "#168b55",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Login as Staff
            </Link>
          </div>
          <br />
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Link
              to="/forgot-password"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default loginPage;
