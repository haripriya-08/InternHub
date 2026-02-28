import axios from "axios";

const baseURL = "https://internhub-4kk1.onrender.com/api";

const API = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("internhub_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
