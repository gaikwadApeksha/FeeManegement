import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function forgotPassword() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/forgot-password",
        {
          username: username,
        },
      );

      setMessage(response.data);
    } catch (error) {
      setError(error.response?.data || "Unable to process request");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f6fb",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <h2>Forgot Password</h2>

        <p>Enter your username to reset your password.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Reset Password
          </button>
        </form>

        {message && <p style={{ color: "green" }}>{message}</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "15px",
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
          }}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

export default forgotPassword;
