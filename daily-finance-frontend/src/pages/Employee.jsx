import { useState } from "react";
import { addEmployee } from "../api/customer";
import { useNavigate } from "react-router-dom";

export default function Employee() {
  const nav = useNavigate();

  const [data, setData] = useState({
    empId: "",
    companyName: "",
    monthlySalary: "",
    experience: ""
  });

  const handleSubmit = async () => {
    try {
      await addEmployee(data);
      alert("Employee added");
      nav("/kyc");
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="container">
      <h2>Employee Details</h2>

      <input placeholder="Employee ID"
        onChange={(e)=>setData({...data, empId:e.target.value})}/>

      <input placeholder="Company Name"
        onChange={(e)=>setData({...data, companyName:e.target.value})}/>

      <input placeholder="Salary"
        onChange={(e)=>setData({...data, monthlySalary:e.target.value})}/>

      <input placeholder="Experience"
        onChange={(e)=>setData({...data, experience:e.target.value})}/>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}