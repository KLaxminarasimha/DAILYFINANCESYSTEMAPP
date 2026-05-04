import axios from "axios";

const API = "http://localhost:9999";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// 🔥 CREATE LOAN
export const createLoan = (planId) =>
  axios.post(
    `${API}/loans`,
    { planId },
    { headers: getAuthHeader() }
  );

// 🔥 GET MY LOANS
export const getMyLoans = () =>
  axios.get(`${API}/loans/my`, {
    headers: getAuthHeader(),
  });

// 🔥 GET SINGLE LOAN
export const getLoanById = (id) =>
  axios.get(`${API}/loans/${id}`, {
    headers: getAuthHeader(),
  });