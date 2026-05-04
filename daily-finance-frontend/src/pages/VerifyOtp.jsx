import { useState } from "react";
import { verifyOtp, resendOtp } from "../api/auth";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const nav = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    try {
      await verifyOtp({ email, otp });

      alert("OTP Verified");
      nav("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(email);
      alert("OTP resent successfully");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="container">
      <h2>Verify OTP</h2>

      <input
        placeholder="Enter OTP"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify}>Verify</button>

      {/* ✅ RESEND */}
      <p
        style={{
          textAlign: "center",
          color: "#22c55e",
          cursor: "pointer",
          marginTop: "10px"
        }}
        onClick={handleResend}
      >
        Resend OTP
      </p>

      {/* ✅ LOGIN OPTION */}
      <p style={{ textAlign: "center" }}>
        Already verified?{" "}
        <span
          style={{ color: "#22c55e", cursor: "pointer" }}
          onClick={() => nav("/login")}
        >
          Login
        </span>
      </p>

    </div>
  );
}