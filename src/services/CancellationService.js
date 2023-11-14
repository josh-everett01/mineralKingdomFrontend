// cancellationService.js
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;

class CancellationService {
  async cancelOrder(orderId) {
    console.log(orderId);
    try {
      const response = await axios.post(
        `${API_URL}checkout/cancel-order`,
        JSON.stringify(orderId),  // orderId is a string, so just stringify it
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  }

  async cancelMineralPurchase(mineralId) {
    try {
      const response = await axios.post(
        `${API_URL}checkout/cancel-mineral-purchase/`,
        mineralId
      );
      return response.data; // Adjust based on your API response
    } catch (error) {
      console.error("Error cancelling mineral purchase:", error);
      throw error;
    }
  }
}

export default new CancellationService();
