import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createLoan } from "../api/loan";

export default function ApplyLoan() {
  const { state } = useLocation();
  const nav = useNavigate();

  const plan = state?.plan;
  const [agree, setAgree] = useState(false);

  if (!plan) return <p>No plan selected</p>;

  const handleApply = async () => {
    if (!agree) {
      alert("Please accept Terms & Conditions");
      return;
    }

    try {
      await createLoan(plan.planId);

      alert("Loan Created Successfully");

      // 🔥 Redirect to dashboard
      nav("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">
      <h2>Confirm Loan</h2>

      {/* PLAN DETAILS */}
      <p><b>Amount:</b> ₹{plan.planAmount}</p>
      <p><b>Daily EMI:</b> ₹{plan.dailyEmi}</p>
      <p><b>Duration:</b> {plan.duration} days</p>

      {/* 🔥 TERMS & CONDITIONS */}
      <div
        style={{
          background: "#f3f4f6",
          padding: "12px",
          marginTop: "15px",
          borderRadius: "8px",
          color: "#111", // ✅ FIXED TEXT VISIBILITY
        }}
      >
        <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
          Terms & Conditions
        </p>

        <ul style={{ fontSize: "13px", paddingLeft: "18px" }}>
          <li>Loan must be repaid daily</li>
          <li>Late payment will incur fine</li>
          <li>Company can take action on default</li>
        </ul>
      </div>

      {/* 🔥 AGREEMENT CHECKBOX */}
      <label style={{ display: "block", marginTop: "10px" }}>
        <input
          type="checkbox"
          onChange={(e) => setAgree(e.target.checked)}
          style={{ marginRight: "6px" }}
        />
        I agree to Terms & Conditions
      </label>

      {/* 🔥 BUTTON */}
      <button
        onClick={handleApply}
        style={{ marginTop: "15px" }}
      >
        Agree & Continue
      </button>
    </div>
  );
}