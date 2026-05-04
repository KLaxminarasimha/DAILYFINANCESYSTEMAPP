import axios from "axios";

const API = "http://localhost:9999";

// 🔥 CREATE AXIOS INSTANCE
const api = axios.create({
  baseURL: API,
  timeout: 10000,
});

// 🔐 ADD TOKEN AUTOMATICALLY
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 RESPONSE ERROR HANDLING (OPTIONAL BUT BEST)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      alert("Session expired. Please login again.");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// 🔥 GET ELIGIBLE PLANS
export const getEligiblePlans = () =>
  api.get("/plans/eligible");

// 🔥 GET SINGLE PLAN
export const getPlanById = (id) =>
  api.get(`/plans/${id}`);