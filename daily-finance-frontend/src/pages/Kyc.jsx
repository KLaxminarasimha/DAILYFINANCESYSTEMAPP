import { useState } from "react";
import { submitKyc, verifyKycOtp } from "../api/customer";
import { useNavigate } from "react-router-dom";

export default function Kyc() {
  const nav = useNavigate();

  const [data, setData] = useState({
    aadhar: "",
    pan: "",
    accountNumber: "",
    ifsc: "",
    phone: "",
    email: ""
  });

  const [otp, setOtp] = useState("");

  const handleSubmit = async () => {
    try {
      await submitKyc(data);
      alert("OTP sent");
    } catch {
      alert("Error");
    }
  };

  const handleVerify = async () => {
    try {
      await verifyKycOtp({ otp });
      alert("KYC Verified");
      nav("/guarantor");
    } catch {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="container">
      <h2>KYC</h2>

      <input placeholder="Aadhar"
        onChange={(e)=>setData({...data,aadhar:e.target.value})}/>

      <input placeholder="PAN"
        onChange={(e)=>setData({...data,pan:e.target.value})}/>

      <input placeholder="Account Number"
        onChange={(e)=>setData({...data,accountNumber:e.target.value})}/>

      <input placeholder="IFSC"
        onChange={(e)=>setData({...data,ifsc:e.target.value})}/>

      <input placeholder="Phone"
        onChange={(e)=>setData({...data,phone:e.target.value})}/>

      <input placeholder="Email"
        onChange={(e)=>setData({...data,email:e.target.value})}/>

      <button onClick={handleSubmit}>Submit KYC</button>

      <input placeholder="OTP"
        onChange={(e)=>setOtp(e.target.value)}/>

      <button onClick={handleVerify}>Verify OTP</button>
    </div>
  );
}