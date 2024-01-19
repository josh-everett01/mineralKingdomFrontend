import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;

class AuctionService {
  async getAuctions() {
    try {
      const response = await axios.get(API_URL + "Auction");
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error fetching auctions:", error);
      throw error;
    }
  }

  async getAuction(id) {
    try {
      const response = await axios.get(API_URL + "Auction/" + id);
      console.log("Auction data fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching auction:", error);
      throw error;
    }
  }

  async addAuction(auctionData) {
    try {
      console.log("Auction Data:", auctionData);
      const response = await axios.post(API_URL + "Auction", auctionData);
      console.log("Auction added:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding auction:", error);
      throw error;
    }
  }

  async updateAuction(id, auctionData) {
    try {
      const response = await axios.put(API_URL + "Auction/" + id, auctionData);
      console.log("Auction updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating auction:", error);
      throw error;
    }
  }

  async deleteAuction(id) {
    try {
      const response = await axios.delete(API_URL + "Auction/" + id);
      console.log("Auction deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting auction:", error);
      throw error;
    }
  }
}

export default new AuctionService();
