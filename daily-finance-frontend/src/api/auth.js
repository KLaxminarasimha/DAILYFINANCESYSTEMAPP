import axios from "axios";

const API = "http://localhost:9999/api/v1";

export const registerCustomer = (data) =>
  axios.post(`${API}/customer/register`, data);

export const verifyOtp = (data) =>
  axios.post(`${API}/auth/verify-otp`, data);

export const resendOtp = (email) =>
  axios.post(`${API}/auth/resend-otp?email=${email}`);

export const loginUser = (data) =>
  axios.post(`${API}/auth/login`, data);

export const getProfile = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/auth/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};