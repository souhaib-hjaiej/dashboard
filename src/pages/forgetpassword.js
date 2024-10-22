import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Tracks the current step
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Step 1: Send Reset Email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/forgot-password", { email });
      if (response.data.success) {
        setMessage("Verification code sent to your email.");
        setStep(2); // Move to Step 2 (Enter Code)
      } else {
        setError("Email not found.");
      }
    } catch (err) {
      setError("Error sending reset email.");
    }
  };

  // Step 2: Verify Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/verify-code", { email, code });
      if (response.data.success) {
        setMessage("Code verified. Please reset your password.");
        setStep(3); // Move to Step 3 (Reset Password)
      } else {
        setError("Invalid code.");
      }
    } catch (err) {
      setError("Error verifying code.");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/reset-password", {
        email,
        newPassword,
      });
      if (response.data.success) {
        setMessage("Password reset successful.");
        setStep(1); // Optionally reset to Step 1 for another password reset
      } else {
        setError("Error resetting password.");
      }
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ width: "300px", padding: "20px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
        <h2>Forgot Password</h2>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {/* Step 1: Send Reset Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendEmail}>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", margin: "10px 0" }}
              />
            </div>
            <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#3f51b5", color: "#fff", border: "none" }}>
              Send Verification Code
            </button>
          </form>
        )}

        {/* Step 2: Verify Code Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div>
              <label>Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", margin: "10px 0" }}
              />
            </div>
            <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#3f51b5", color: "#fff", border: "none" }}>
              Verify Code
            </button>
          </form>
        )}

        {/* Step 3: Reset Password Form */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", margin: "10px 0" }}
              />
            </div>
            <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#3f51b5", color: "#fff", border: "none" }}>
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
