import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function staffLogin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        username,
        password,
      });
      console.log("LOGIN RESPONSE:", response.data);

      if (response.data) {
        localStorage.setItem("staffUser", JSON.stringify(response.data));

        navigate("/staffdashboard");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError("Invalid staff username or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/back.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Blur Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(6px)",
          background: "rgba(255,255,255,0.15)",
        }}
      ></div>

      {/* Login Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          padding: "35px 30px",
          borderRadius: "24px",
          textAlign: "center",
          boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
          zIndex: 1,
        }}
      >
        <img
          src="/logo.webp.png"
          alt="School Logo"
          style={{
            width: "150px",
            marginBottom: "15px",
          }}
        />

        <h1
          style={{
            fontSize: "28px",
            fontWeight: "800",
            margin: "0 0 15px",
            lineHeight: "1.2",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#FF0000" }}>M</span>
          <span style={{ color: "#FF7F00" }}>i</span>
          <span style={{ color: "#FFD700" }}>l</span>
          <span style={{ color: "#32CD32" }}>l</span>
          <span style={{ color: "#00BFFF" }}>e</span>
          <span style={{ color: "#8A2BE2" }}>n</span>
          <span style={{ color: "#FF1493" }}>n</span>
          <span style={{ color: "#FF4500" }}>i</span>
          <span style={{ color: "#1E90FF" }}>u</span>
          <span style={{ color: "#32CD32" }}>m</span>{" "}
          <span style={{ color: "#FF0000" }}> K</span>
          <span style={{ color: "#FF7F00" }}>i</span>
          <span style={{ color: "#FFD700" }}>d</span>
          <span style={{ color: "#32CD32" }}>s</span>
          <span style={{ color: "#00BFFF" }}>s</span>{" "}
          <span style={{ color: "#ff1493" }}>Nagpur</span>
        </h1>
        <h3
          style={{
            color: "#168b55",
            fontSize: "25px",
            fontWeight: "700",
            marginBottom: "28px",
          }}
        >
          Center head Login
        </h3>

        <form onSubmit={handleLogin}>
          {/* Username */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                fontWeight: "600",
                marginBottom: "8px",
                display: "block",
                color: "#333",
              }}
            >
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Staff Username"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          {/* Password */}
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label
              style={{
                fontWeight: "600",
                marginBottom: "8px",
                display: "block",
                color: "#333",
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                color: "red",
                marginBottom: "15px",
              }}
            >
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #198754, #146c43)",
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        {/* Admin Login Link */}
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
          Are you an administrator?{" "}
          <Link
            to="/"
            style={{
              color: "#168b55",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Login as Admin
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
      </div>
    </div>
  );
}

export default staffLogin;
