import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import CreateProfile from "./pages/CreateProfile";
import Employee from "./pages/Employee";
import Business from "./pages/Business";
import Kyc from "./pages/Kyc";
import Guarantor from "./pages/Guarantor";

import Plans from "./pages/Plans";
import ApplyLoan from "./pages/ApplyLoan";
import LoanDashboard from "./pages/LoanDashboard";
import Payment from "./pages/Payment";
import Transactions from "./pages/Transactions";





function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<VerifyOtp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/transactions" element={<Transactions />} />

      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/employee" element={<Employee />} />
      <Route path="/business" element={<Business />} />
      <Route path="/kyc" element={<Kyc />} />
      <Route path="/guarantor" element={<Guarantor />} />

      <Route path="/plans" element={<Plans />} />
      <Route path="/apply-loan" element={<ApplyLoan />} />
      <Route path="/loans" element={<LoanDashboard />} />
    </Routes>
  );
}

export default App;