import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
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
