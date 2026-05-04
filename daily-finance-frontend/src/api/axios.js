import axios from "axios";

const API = "http://localhost:9999/api/v1";

export const registerCustomer = (data) =>
  axios.post(`${API}/customer/register`, data, {
    headers: {
      "Content-Type": "application/json",
    }
    // ❌ REMOVE withCredentials
  });