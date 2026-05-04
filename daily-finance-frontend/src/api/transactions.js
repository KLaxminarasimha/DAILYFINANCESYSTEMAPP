import axios from "axios";

const API = "http://localhost:9999"; // gateway

export const getTransactionsByLoan = (loanId) => {
  return axios.get(`${API}/transactions/${loanId}`);
};

export const getTransactionSummary = () => {
  return axios.get(`${API}/transactions/summary`);
};