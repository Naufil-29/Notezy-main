import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://your-backend.onrender.com"
});

// Add token to every request if exists // Attach token automatically (for future protected calls)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
