import axios from "axios";

const API_URL = "https://localhost:7240/api/";

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

  async getAuctionForMineral(mineralId) {
    try {
      const response = await axios.get(API_URL + "Auction");
      console.log(response);

      // Find the auction that has the same mineralId as the one passed in
      const auctionForMineral = response.data.find(
        (auction) => auction.mineralId === mineralId
      );

      // If no auction is found, auctionForMineral will be undefined
      if (!auctionForMineral) {
        console.log(`No auction found for mineral with ID: ${mineralId}`);
        return null; // or you can throw an error or return undefined, based on your preference
      }

      return auctionForMineral;
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
