import { useEffect, useState } from "react";
import { getMyLoans } from "../api/loan";

export default function LoanDashboard() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await getMyLoans();
      setLoans(res.data);
    } catch {
      alert("Failed to load loans");
    }
  };

  return (
    <div className="container">
      <h2>My Loans</h2>

      {loans.length === 0 ? (
        <p>No loans found</p>
      ) : (
        loans.map((l) => (
          <div
            key={l.loanId}
            style={{
              border: "1px solid #22c55e",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              color: "#111",
            }}
          >
            <p><b>Loan ID:</b> {l.loanId}</p>
            <p><b>Amount:</b> ₹{l.planAmount}</p>
            <p><b>Remaining:</b> ₹{l.remainingAmount}</p>

            <p style={{ color: "#22c55e" }}>
              Daily EMI: ₹{l.dailyEmi}
            </p>

            <p><b>Remaining Days:</b> {l.remainingDays}</p>

            <p><b>Due:</b> ₹{l.dueAmount}</p>
            <p><b>Fine:</b> ₹{l.fineAmount}</p>

            <p
              style={{
                color:
                  l.status === "ACTIVE" ? "green" : "red",
              }}
            >
              <b>Status:</b> {l.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}