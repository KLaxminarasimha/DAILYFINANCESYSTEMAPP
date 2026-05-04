import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!data.email || !data.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(data);

      console.log("LOGIN RESPONSE:", res.data); // 🔥 DEBUG

      // 🔐 SAFE TOKEN EXTRACTION (handles all backend formats)
      const token =
        res.data?.data?.token ||
        res.data?.token ||
        res.data?.data;

      if (!token) {
        throw new Error("Token not found in response");
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("token", token);

      alert("Login successful");

      // 🚀 REDIRECT
      nav("/dashboard");

    } catch (err) {
      console.log("LOGIN ERROR:", err.response || err.message);

      alert(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      {/* EMAIL */}
      <input
        placeholder="Email"
        value={data.email}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
      />

      {/* PASSWORD */}
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          placeholder="Password"
          value={data.password}
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
          style={{ width: "100%" }}
        />

        <span
          onClick={() => setShow(!show)}
          style={{
            position: "absolute",
            right: "10px",
            top: "8px",
            cursor: "pointer",
            fontSize: "12px",
            color: "#22c55e",
          }}
        >
          {show ? "Hide" : "Show"}
        </span>
      </div>

      {/* LOGIN BUTTON */}
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* REGISTER LINK */}
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Don't have an account?{" "}
        <span
          style={{ color: "#22c55e", cursor: "pointer" }}
          onClick={() => nav("/")}
        >
          Register
        </span>
      </p>
    </div>
  );
}