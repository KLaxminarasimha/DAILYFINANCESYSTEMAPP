import { useState } from "react";
import { createProfile } from "../api/customer";
import { useNavigate } from "react-router-dom";

export default function CreateProfile() {
  const nav = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    userType: "",
  });

  const handleSubmit = async () => {
    try {
      await createProfile(data);

      alert("Profile created");

      if (data.userType === "EMPLOYEE") {
        nav("/employee");
      } else {
        nav("/business");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">
      <h2>Create Profile</h2>

      <input placeholder="First Name"
        onChange={(e)=>setData({...data, firstName:e.target.value})}/>

      <input placeholder="Last Name"
        onChange={(e)=>setData({...data, lastName:e.target.value})}/>

      <input placeholder="Email"
        onChange={(e)=>setData({...data, email:e.target.value})}/>

      <input placeholder="Phone"
        onChange={(e)=>setData({...data, phone:e.target.value})}/>

      <input type="date"
        onChange={(e)=>setData({...data, dob:e.target.value})}/>

      <select onChange={(e)=>setData({...data, gender:e.target.value})}>
        <option value="">Select Gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
      </select>

      <input placeholder="Address"
        onChange={(e)=>setData({...data, address:e.target.value})}/>

      <input placeholder="City"
        onChange={(e)=>setData({...data, city:e.target.value})}/>

      <input placeholder="State"
        onChange={(e)=>setData({...data, state:e.target.value})}/>

      <input placeholder="Pincode"
        onChange={(e)=>setData({...data, pincode:e.target.value})}/>

      <select onChange={(e)=>setData({...data, userType:e.target.value})}>
        <option value="">Select Type</option>
        <option value="EMPLOYEE">Employee</option>
        <option value="BUSINESS">Business</option>
      </select>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}