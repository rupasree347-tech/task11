import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response &&
      error.response.status === 401
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;