import { useState } from "react";
import { addGuarantor } from "../api/customer";
import { useNavigate } from "react-router-dom";

export default function Guarantor() {
  const nav = useNavigate();

  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    pan: "",
    relation: "",
    address: "",
  });

  const handleSubmit = async () => {
    try {
      await addGuarantor(data);  // 🔥 no need to pass id

      alert("Guarantor added successfully");

      // ✅ REDIRECT TO DASHBOARD
      nav("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">
      <h2>Add Guarantor</h2>

      <input placeholder="Name"
        onChange={(e)=>setData({...data, name:e.target.value})}/>

      <input placeholder="Phone"
        onChange={(e)=>setData({...data, phone:e.target.value})}/>

      <input placeholder="Email"
        onChange={(e)=>setData({...data, email:e.target.value})}/>

      <input placeholder="PAN"
        onChange={(e)=>setData({...data, pan:e.target.value})}/>

      <input placeholder="Relation"
        onChange={(e)=>setData({...data, relation:e.target.value})}/>

      <input placeholder="Address"
        onChange={(e)=>setData({...data, address:e.target.value})}/>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}