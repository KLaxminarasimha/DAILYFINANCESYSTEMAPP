import { useEffect, useState } from "react";
import { getEligiblePlans } from "../api/plan";
import { useNavigate } from "react-router-dom";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await getEligiblePlans();
      setPlans(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load plans");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>Eligible Loan Plans</h2>

      {plans.length === 0 ? (
        <p style={{ textAlign: "center" }}>No plans available</p>
      ) : (
        plans.map((p) => {
          const isActive = p.status === "ACTIVE";

          return (
            <div
              key={p.planId}
              style={{
                border: isActive ? "1px solid #22c55e" : "1px solid red",
                backgroundColor: isActive ? "#f0fdf4" : "#fee2e2",
                padding: "20px",
                margin: "20px auto",
                borderRadius: "12px",
                width: "350px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                color: "#111", // 🔥 FIX TEXT VISIBILITY
              }}
            >
              {/* 🔥 ALL FIELDS */}
              <p><b>Plan ID:</b> {p.planId}</p>

              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                ₹{p.planAmount}
              </p>

              <p><b>Disbursed:</b> ₹{p.disbursedAmount}</p>
              <p><b>Interest:</b> ₹{p.interestAmount}</p>
              <p><b>Total Payable:</b> ₹{p.totalPayable}</p>

              <p style={{ color: "#22c55e", fontWeight: "bold" }}>
                Daily EMI: ₹{p.dailyEmi}
              </p>

              <p><b>Duration:</b> {p.duration} days</p>

              <p style={{ color: isActive ? "green" : "red" }}>
                <b>Status:</b> {p.status}
              </p>

              {/* 🔴 Inactive Info */}
              {!isActive && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  Not eligible / insufficient fund
                </p>
              )}

              {/* 🔥 BUTTON */}
              <button
                disabled={!isActive}
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  width: "100%",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: isActive ? "#22c55e" : "gray",
                  color: "white",
                  fontWeight: "bold",
                  cursor: isActive ? "pointer" : "not-allowed",
                }}
                onClick={() =>
                  isActive &&
                  nav("/apply-loan", { state: { plan: p } })
                }
              >
                {isActive ? "Select Plan" : "Not Available"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}