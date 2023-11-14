// services/UserService.js

import axios from "axios";

const API_URL = "https://localhost:7240/api/";

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
}

export default new UserService();
