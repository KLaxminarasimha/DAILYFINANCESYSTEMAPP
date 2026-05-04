import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { payEmi, getPayments } from "../api/payment";
import { getLoanById } from "../api/loan";

export default function Payment() {
  const location = useLocation();
  const nav = useNavigate();

  const loanId = location.state?.loanId;

  const [loan, setLoan] = useState(null);
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loanId) {
      nav("/dashboard");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const loanRes = await getLoanById(loanId);
      setLoan(loanRes.data);

      const payRes = await getPayments(loanId);
      setHistory(payRes.data);
    } catch (err) {
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      await payEmi({
        loanId: loanId,
        amount: amount,
      });

      alert("Payment Successful ✅");

      setAmount("");
      fetchData(); // refresh data
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Loan Payment</h2>

      {/* 🔥 LOAN CARD */}
      {loan && (
        <div
          style={{
            background: "#0f172a",
            padding: "20px",
            borderRadius: "12px",
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#22c55e" }}>Loan #{loan.loanId}</h3>

          <p><b>Total:</b> ₹{loan.planAmount}</p>
          <p><b>Remaining:</b> ₹{loan.remainingAmount}</p>

          <p style={{ color: "#22c55e" }}>
            <b>Daily EMI:</b> ₹{loan.dailyEmi}
          </p>

          <p><b>Due:</b> ₹{loan.dueAmount}</p>

          <p style={{ color: loan.fineAmount > 0 ? "red" : "#fff" }}>
            <b>Fine:</b> ₹{loan.fineAmount}
          </p>

          <p><b>Days Left:</b> {loan.remainingDays}</p>
        </div>
      )}

      {/* 🔥 PAYMENT INPUT */}
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <button onClick={handlePay}>Pay Now</button>

      {/* 🔥 QUICK BUTTONS */}
      {loan && (
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => setAmount(loan.dailyEmi)}>
            Pay EMI
          </button>

          <button onClick={() => setAmount(loan.remainingAmount)}>
            Close Loan
          </button>
        </div>
      )}

      {/* 🔥 PAYMENT HISTORY */}
      <h3 style={{ marginTop: "30px" }}>Payment History</h3>

      {history.length === 0 ? (
        <p>No payments yet</p>
      ) : (
        history.map((p) => (
          <div
            key={p.paymentId}
            style={{
              border: "1px solid #22c55e",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "8px",
              background: "#020617",
              color: "#fff",
            }}
          >
            <p><b>Amount:</b> ₹{p.amount}</p>

            <p>
              <b>Type:</b>{" "}
              <span
                style={{
                  color:
                    p.type === "EMI"
                      ? "#22c55e"
                      : p.type === "PARTIAL"
                      ? "#facc15"
                      : "#3b82f6",
                }}
              >
                {p.type}
              </span>
            </p>

            <p><b>Status:</b> {p.status}</p>
            <p><b>Date:</b> {p.paymentDate}</p>
          </div>
        ))
      )}
    </div>
  );
}