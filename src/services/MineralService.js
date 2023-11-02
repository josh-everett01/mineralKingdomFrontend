import axios from "axios";

const API_URL = "https://localhost:7240/api/";

class MineralService {
  async getMinerals() {
    try {
      const response = await axios.get(API_URL + "Minerals");
      console.log(response)
      return response.data;
    } catch (error) {
      console.error("Error fetching minerals:", error);
      throw error;
    }
  }

  async getMineral(id) {
    try {
      const response = await axios.get(API_URL + "Minerals/" + id);
      console.log("Mineral data fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching mineral:", error);
      throw error;
    }
  }
}

export default new MineralService();
