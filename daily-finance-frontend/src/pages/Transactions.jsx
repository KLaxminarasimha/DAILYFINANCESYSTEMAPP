import { useEffect, useState } from "react";
import { getTransactionsByLoan, getTransactionSummary } from "../api/transactions";
import { getMyLoans } from "../api/loan";

export default function Transactions() {
  const [loans, setLoans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
    fetchSummary();
  }, []);

  // 🔥 LOAD LOANS
  const fetchLoans = async () => {
    try {
      const res = await getMyLoans();
      setLoans(res.data || []);
    } catch (err) {
      console.log("Loan Error:", err);
    }
  };

  // 🔥 LOAD SUMMARY
  const fetchSummary = async () => {
    try {
      const res = await getTransactionSummary();
      setSummary(res.data);
    } catch (err) {
      console.log("Summary Error:", err);
    }
  };

  // 🔥 LOAD TRANSACTIONS
  const fetchTransactions = async (loanId) => {
    try {
      setLoading(true);

      const res = await getTransactionsByLoan(loanId);

      console.log("TRANSACTION RESPONSE:", res.data);

      // ✅ SAFE HANDLING
      if (res && res.data) {
        setTransactions(res.data);
        setSelectedLoan(loanId);
      } else {
        setTransactions([]);
      }

    } catch (err) {
      console.log("TRANSACTION ERROR:", err);

      // ❌ Removed wrong generic alert
      alert(err.response?.data?.message || err.message || "Failed to fetch");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Transactions</h2>

      {/* 🔥 SUMMARY */}
      {summary && (
        <div
          style={{
            background: "#0f172a",
            padding: "15px",
            color: "#fff",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <h3>Summary</h3>
          <p>Total Credit: ₹{summary.totalCredit}</p>
          <p>Total Debit: ₹{summary.totalDebit}</p>
          <p style={{ color: "#22c55e" }}>
            Profit: ₹{summary.profit}
          </p>
        </div>
      )}

      {/* 🔥 LOAN SELECTION */}
      {!selectedLoan && (
        <>
          <h3>Select Loan</h3>

          {loans.length === 0 ? (
            <p>No loans available</p>
          ) : (
            loans.map((l) => (
              <button
                key={l.loanId}
                onClick={() => fetchTransactions(l.loanId)}
                style={{
                  display: "block",
                  margin: "10px auto",
                  padding: "10px 20px",
                  background: "#22c55e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Loan #{l.loanId}
              </button>
            ))
          )}
        </>
      )}

      {/* 🔥 TRANSACTIONS LIST */}
      {selectedLoan && (
        <>
          <button
            onClick={() => {
              setSelectedLoan(null);
              setTransactions([]);
            }}
            style={{ marginBottom: "15px" }}
          >
            ← Back
          </button>

          <h3>Loan #{selectedLoan}</h3>

          {loading ? (
            <p>Loading...</p>
          ) : transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            transactions.map((t) => (
              <div
                key={t.transactionId}
                style={{
                  border: "1px solid #22c55e",
                  padding: "12px",
                  marginTop: "10px",
                  borderRadius: "10px",
                  background: "#020617",
                  color: "#fff",
                }}
              >
                <p><b>Amount:</b> ₹{t.amount}</p>

                <p>
                  <b>Type:</b>{" "}
                  <span
                    style={{
                      color:
                        t.type === "LOAN_DISBURSE"
                          ? "#facc15"
                          : t.type === "ADVANCE"
                          ? "#22c55e"
                          : "#38bdf8",
                    }}
                  >
                    {t.type}
                  </span>
                </p>

                <p>
                  <b>Direction:</b>{" "}
                  <span
                    style={{
                      color:
                        t.direction === "CREDIT"
                          ? "#22c55e"
                          : "#ef4444",
                    }}
                  >
                    {t.direction}
                  </span>
                </p>

                <p><b>Status:</b> {t.status}</p>

                <p>
                  <b>Date:</b>{" "}
                  {new Date(t.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}