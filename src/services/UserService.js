// services/UserService.js

import axios from "axios";

// const API_URL = "https://localhost/api/";

const API_URL = process.env.VUE_APP_API_URL;

class UserService {
  async getUserById(id) {
    try {
      const response = await axios.get(API_URL + "User/" + id);
      console.log("User data fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async partiallyUpdateUser(userId, partialUpdateUserDTO) {
    try {
      const response = await axios.patch(
        API_URL + "User/" + userId,
        partialUpdateUserDTO
      );
      console.log("User data updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async getUserPayments(userId) {
    try {
      const response = await axios.get(
        `${API_URL}checkout/user-payments/${userId}`
      );
      console.log("User payment data fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user payments:", error);
      throw error;
    }
  }
}

export default new UserService();
