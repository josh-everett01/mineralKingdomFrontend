import axios from "../axios-config";
import store from "../store";

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
    return apiClient.post("/User/login", credentials).then((response) => {
      console.log("Login API response:", response.data);
      // Check if the user is an admin
      if (response.data.userRole == 1) {
        // Dispatch action to set adminId in the Vuex store
        store.dispatch("correspondence/setAdminId", response.data.id);
      }
      return response.data;
    });
  },
  register(credentials) {
    return apiClient.post("/User/register", credentials);
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
    return apiClient.post(
      "/User/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
