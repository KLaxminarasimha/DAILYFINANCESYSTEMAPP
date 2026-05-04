import axios from "axios";

const API = "http://localhost:9999";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// 🔥 PAY EMI / PARTIAL / ADVANCE
export const payEmi = (data) =>
  axios.post(`${API}/payments/pay`, data, {
    headers: getAuthHeader(),
  });

// 🔥 GET PAYMENT HISTORY
export const getPayments = (loanId) =>
  axios.get(`${API}/payments/${loanId}`, {
    headers: getAuthHeader(),
  });