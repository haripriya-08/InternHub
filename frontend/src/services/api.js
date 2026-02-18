import axios from "axios";

const baseURL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "") + "/api"
    : "/api";

const API = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("internhub_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
