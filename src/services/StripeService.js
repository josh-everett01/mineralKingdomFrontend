import axios from "axios";

require('dotenv').config();

const API_URL = process.env.API_URL;

class StripeService {
  async createCheckoutSession(purchaseData) {
    try {
      const response = await axios.post(API_URL + 'checkout/purchase-mineral', purchaseData);
      console.log(response);
      return response.data.sessionId; // Adjust this line based on how your backend sends the session ID
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}

export default new StripeService();
