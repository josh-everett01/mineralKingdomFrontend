import axios from "../axios-config";

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
      .then(response => {
        console.log("Login API response:", response.data);
        return response.data;
      });
  },
  register(credentials) {
    return apiClient.post("/User/register", credentials)
  },
  verifyEmail(token) {
    return apiClient.post("/User/verify-email", JSON.stringify(token), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  refreshToken() {
    return apiClient.post("/User/refresh-token");
  },
  logout(token) {
    return apiClient.post("/User/logout", {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};
