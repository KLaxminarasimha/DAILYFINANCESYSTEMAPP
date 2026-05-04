import { useEffect, useState } from "react";
import { getMyProfile } from "../api/customer";
import { getMyLoans } from "../api/loan";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const profileRes = await getMyProfile();
      setProfile(profileRes.data);

      const loanRes = await getMyLoans();
      setLoans(loanRes.data);

    } catch (err) {
      console.log("ERROR:", err);

      if (err.response?.status === 500) {
        nav("/create-profile");
      } else if (err.response?.status === 401) {
        localStorage.removeItem("token");
        nav("/login");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : profile ? (
        <>
          {/* 🔥 PROFILE */}
          <div style={{ marginBottom: "20px" }}>
            <p><b>Name:</b> {profile.firstName} {profile.lastName}</p>
            <p><b>User Type:</b> {profile.userType}</p>
          </div>

          {/* 🔥 ACTION BUTTONS */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => nav("/create-profile")}>
              Update Profile
            </button>

            <button onClick={() => nav("/kyc")}>
              KYC Verification
            </button>

            <button onClick={() => nav("/plans")}>
              View Loan Plans
            </button>

            {/* 🔥 NEW GLOBAL PAYMENT BUTTON */}
            <button onClick={() => nav("/payment")}>
              Payments
            </button>
            <button onClick={() => nav("/transactions")}>
  Transactions
</button>
          </div>

          {/* 🔥 LOANS */}
          <h3 style={{ marginTop: "30px" }}>My Loans</h3>

          {loans.length === 0 ? (
            <p>No loan yet</p>
          ) : (
            loans.map((l) => {
              const progress =
                ((l.totalDays - l.remainingDays) / l.totalDays) * 100;

              return (
                <div
                  key={l.loanId}
                  style={{
                    border: "1px solid #22c55e",
                    padding: "18px",
                    marginTop: "15px",
                    borderRadius: "12px",
                    background: "#0f172a",
                    color: "#ffffff",
                  }}
                >
                  <h3 style={{ color: "#22c55e" }}>
                    Loan #{l.loanId}
                  </h3>

                  <p><b>Plan ID:</b> {l.planId}</p>
                  <p><b>Total Amount:</b> ₹{l.planAmount}</p>
                  <p><b>Disbursed:</b> ₹{l.disbursedAmount}</p>

                  <p style={{ color: "#22c55e" }}>
                    <b>Daily EMI:</b> ₹{l.dailyEmi}
                  </p>

                  <p>
                    <b>Status:</b>{" "}
                    <span
                      style={{
                        color:
                          l.status === "ACTIVE" ? "#22c55e" : "#ef4444",
                        fontWeight: "bold",
                      }}
                    >
                      {l.status}
                    </span>
                  </p>

                  <p><b>Remaining:</b> ₹{l.remainingAmount}</p>
                  <p><b>Due:</b> ₹{l.dueAmount}</p>

                  <p style={{ color: l.fineAmount > 0 ? "#ef4444" : "#fff" }}>
                    <b>Fine:</b> ₹{l.fineAmount}
                  </p>

                  <p><b>Start Date:</b> {l.startDate}</p>
                  <p><b>Days:</b> {l.remainingDays} / {l.totalDays}</p>

                  {/* 🔥 PROGRESS BAR */}
                  <div
                    style={{
                      height: "8px",
                      background: "#1e293b",
                      borderRadius: "5px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        background: "#22c55e",
                        height: "100%",
                        borderRadius: "5px",
                      }}
                    />
                  </div>

                  {/* 🔥 OVERDUE */}
                  {l.dueAmount > 0 && (
                    <p style={{ color: "#ef4444", marginTop: "8px" }}>
                      ⚠ Overdue Payment!
                    </p>
                  )}

                  {/* 🔥 PAY BUTTON */}
                  {l.status === "ACTIVE" && (
                    <button
                      style={{ marginTop: "12px" }}
                      onClick={() =>
                        nav("/payment", {
                          state: { loanId: l.loanId },
                        })
                      }
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              );
            })
          )}
        </>
      ) : (
        <p>No profile found</p>
      )}
    </div>
  );
}