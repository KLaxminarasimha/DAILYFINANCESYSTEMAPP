import axios from "axios";

const API = "http://localhost:9999";

const getHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// PROFILE
export const createProfile = (data) =>
  axios.post(`${API}/customers/profile`, data, { headers: getHeader() });

export const getMyProfile = () =>
  axios.get(`${API}/customers/me`, { headers: getHeader() });

// EMPLOYEE
export const addEmployee = (data) =>
  axios.post(`${API}/customers/employee`, data, { headers: getHeader() });

// BUSINESS
export const addBusiness = (data) =>
  axios.post(`${API}/customers/business`, data, { headers: getHeader() });

// KYC
export const submitKyc = (data) =>
  axios.post(`${API}/customers/kyc`, data, { headers: getHeader() });

export const verifyKycOtp = (data) =>
  axios.post(`${API}/customers/kyc/verify`, data, { headers: getHeader() });

// GUARANTOR
export const addGuarantor = (data) =>
  axios.post(`${API}/customers/guarantor`, data, { headers: getHeader() });