import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL

class BidService {
  async createBid(bidData) {
    try {
      console.log(bidData);
      const response = await axios.post(API_URL + "Bid", bidData);
      return response.data;
    } catch (error) {
      console.error("Error creating bid:", error);
      throw error;
    }
  }

  async getWinningBidForCompletedAuction(auctionId) {
    try {
      console.log("WINNINGBIDFORCZOMPEL" + auctionId);
      const response = await axios.get(
        API_URL + "Auction/" + auctionId + "/completed/winning-bid"
      );
      console.log("Winning bid for completed auction:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching winning bid for completed auction:", error);
      throw error;
    }
  }

  async getCurrentWinningBidForAuction(auctionId) {
    try {
      const response = await axios.get(
        API_URL + "Auction/" + auctionId + "/winning-bid"
      );
      console.log("CURRENTHIGHESTBDIRESPONSE: " + { response });
      return response;
    } catch (error) {
      console.error("Error fetching current winning bid:", error);
      throw error;
    }
  }

  async updateBid(bidId, bidData) {
    try {
      const response = await axios.put(API_URL + "Bid/" + bidId, bidData);
      return response.data;
    } catch (error) {
      console.error("Error updating bid:", error);
      throw error;
    }
  }

  // In BidService
  async calculateBidIncrement(currentBid) {
    try {
      const response = await axios.get(API_URL + "Bid/" + "calculate-bid-increment", {
        params: { currentBid }
      });
      console.log("Bid increment:", response.data.bidIncrement);
      return response.data.bidIncrement;
    } catch (error) {
      console.error("Error fetching bid increment:", error);
      throw error;
    }
  }


  async deleteBid(bidId) {
    try {
      const response = await axios.delete(API_URL + "Bid/" + bidId);
      return response.data;
    } catch (error) {
      console.error("Error deleting bid:", error);
      throw error;
    }
  }

  async getBidsForAuction(auctionId) {
    try {
      const response = await axios.get(
        API_URL + "Auction/" + auctionId + "/bids"
      );
      console.log("Bids for auction fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching bids for auction:", error);
      throw error;
    }
  }
}

export default new BidService();
