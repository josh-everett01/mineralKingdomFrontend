import axios from "axios";

const API_URL = "https://localhost:7240/api/";

class MineralService {
  async getMinerals() {
    try {
      const response = await axios.get(API_URL + "Minerals");
      response.data.forEach((element) => {
        console.log(element);
      });
      console.log("Response: " + response.data);
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
  async addMineral(mineralData) {
    try {
      console.log(mineralData);
      // Ensure the status field is set to a valid value
      mineralData.status = mineralData.status === "Available" ? 0 : 1; // Convert status to the expected integer value
      console.log("Mineral Data:", mineralData); // Make sure to log objects, not concatenate them as strings
      const response = await axios.post(API_URL + "Minerals", mineralData); // Send the mineralData directly
      console.log("Mineral added:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding mineral:", error);
      throw error;
    }
  }

  async checkMineralAvailability(mineralIds) {
    try {
      const availableMinerals = [];

      for (const id of mineralIds) {
        const mineral = await this.getMineral(id);
        if (mineral.status !== 1) {
          availableMinerals.push(id);
        }
      }

      return availableMinerals;
    } catch (error) {
      console.error("Error checking mineral availability:", error);
      throw error;
    }
  }
}

export default new MineralService();
