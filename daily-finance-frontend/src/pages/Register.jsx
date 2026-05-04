import { useState } from "react";
import { registerCustomer } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [show, setShow] = useState(false);

  const handleSubmit = async () => {
    try {
      const res = await registerCustomer(data);

      alert(res.data.message);
      nav("/verify", { state: { email: data.email } });

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input placeholder="Name"
        onChange={(e)=>setData({...data,name:e.target.value})}
      />

      <input placeholder="Email"
        onChange={(e)=>setData({...data,email:e.target.value})}
      />

      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          placeholder="Password"
          onChange={(e)=>setData({...data,password:e.target.value})}
          style={{ width: "100%" }}
        />
        <span onClick={()=>setShow(!show)} className="toggle">
          {show ? "Hide" : "Show"}
        </span>
      </div>

      <input placeholder="Phone"
        onChange={(e)=>setData({...data,phone:e.target.value})}
      />

      <button onClick={handleSubmit}>Register</button>

      {/* ✅ LOGIN OPTION (FIXED POSITION) */}
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Already have an account?{" "}
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