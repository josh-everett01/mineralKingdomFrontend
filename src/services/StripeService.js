import axios from "axios";

require("dotenv").config();

const API_URL = process.env.VUE_APP_API_URL;
console.log("API URL: " + API_URL);
class StripeService {
  async createCheckoutSession(purchaseData) {
    try {
      console.log(purchaseData);
      console.log(API_URL);
      const response = await axios.post(
        API_URL + "checkout/purchase-mineral",
        purchaseData
      );
      console.log(response);
      return response.data.sessionId; // Adjust this line based on how your backend sends the session ID
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }
  async createCartCheckoutSession(cartData) {
    try {
      console.log(cartData);
      console.log(cartData.total);
      const response = await axios.post(API_URL + "checkout", cartData);
      console.log(response.data);
      return response.data.sessionId;
    } catch (error) {
      console.error("Error creating cart checkout session:", error);
      throw error;
    }
  }
}

export default new StripeService();
