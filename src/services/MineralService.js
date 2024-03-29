import axios from "axios";

// const API_URL = "https://localhost/api/";
const API_URL = process.env.VUE_APP_API_URL;

class MineralService {
  async getMinerals() {
    try {
      const response = await axios.get(API_URL + "Minerals");
      console.log("Response: " + response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching minerals:", error);
      throw error;
    }
  }

  async getMineral(id) {
    if (!id) {
      console.error("Invalid or missing mineral ID:", id);
      return null; // Return null to indicate that the mineral was not found
    }
    try {
      console.log("Mineral ID:", id);
      const response = await axios.get(API_URL + "Minerals/" + id);
      console.log("Mineral data fetched:", response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn(`Mineral with ID ${id} not found.`);
        return null; // Return null to indicate that the mineral was not found
      }
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
      mineralIds.forEach((mineral) => {
        console.log(mineral);
      });
      console.log("In MineralService: " + availableMinerals);
      for (const mineralId of mineralIds) {
        const mineral = await this.getMineral(mineralId.mineralId);
        if (mineral.status !== 1) {
          availableMinerals.push(mineralId.mineralId);
        }
      }

      return availableMinerals;
    } catch (error) {
      console.error("Error checking mineral availability:", error);
      throw error;
    }
  }

  async mineralExists(id) {
    try {
      const response = await axios.get(API_URL + "Minerals/" + id);
      return response.status === 200; // If the request is successful, the mineral exists
    } catch (error) {
      console.error("Error checking if mineral exists:", error);
      return false; // If there's an error (e.g., 404 not found), the mineral does not exist
    }
  }

  async updateMineral(mineralId, mineralData) {
    try {
      const response = await axios.put(
        API_URL + "Minerals/" + mineralId,
        mineralData
      );
      console.log("Mineral updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating mineral:", error);
      throw error;
    }
  }

  async deleteMineral(mineralId) {
    if (!mineralId) {
      console.error("Invalid or missing mineral ID:", mineralId);
      return; // Return early to prevent API call with invalid URL
    }
    try {
      const response = await axios.delete(API_URL + "Minerals/" + mineralId);
      console.log(`Mineral with ID: ${mineralId} deleted successfully.`);
      return response.data; // Return the response data (if any)
    } catch (error) {
      console.error(`Error deleting mineral with ID: ${mineralId}:`, error);
      throw error; // Rethrow the error to handle it in the calling method
    }
  }
}

export default new MineralService();
