import { useState } from "react";
import { addBusiness } from "../api/customer";
import { useNavigate } from "react-router-dom";

export default function Business() {
  const nav = useNavigate();

  const [data, setData] = useState({
    businessName: "",
    businessType: "",
    gstNumber: "",
    monthlyIncome: ""
  });

  const handleSubmit = async () => {
    try {
      await addBusiness(data);
      alert("Business added");
      nav("/kyc");
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="container">
      <h2>Business Details</h2>

      <input placeholder="Business Name"
        onChange={(e)=>setData({...data, businessName:e.target.value})}/>

      <input placeholder="Business Type"
        onChange={(e)=>setData({...data, businessType:e.target.value})}/>

      <input placeholder="GST"
        onChange={(e)=>setData({...data, gstNumber:e.target.value})}/>

      <input placeholder="Income"
        onChange={(e)=>setData({...data, monthlyIncome:e.target.value})}/>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}