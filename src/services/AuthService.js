import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7240/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  login(credentials) {
    return apiClient.post("/User/login", credentials)
  },
  register(credentials) {
    return apiClient.post("/User/register", credentials)
  },
  // In AuthService.js
  verifyEmail(token) {
    return apiClient.post("/User/verify-email", JSON.stringify(token), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
