import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL + "Correspondence";

class CorrespondenceService {
  async submitInquiry(inquiryData) {
    try {
      const response = await axios.post(API_URL, inquiryData);
      console.log("Inquiry submitted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      throw error;
    }
  }

  async getInquiriesByCustomer(customerId) {
    try {
      const response = await axios.get(
        API_URL + `/customer/${customerId}`
      );
      console.log("Inquiries fetched for customer:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching inquiries for customer:", error);
      throw error;
    }
  }

  async getAllInquiries() {
    try {
      const response = await axios.get(API_URL + "/admin");
      console.log("All inquiries fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all inquiries:", error);
      throw error;
    }
  }

  async respondToInquiry(inquiryId, responseDto) {
    try {
      const response = await axios.post(
        API_URL + `/respond/${inquiryId}`,
        responseDto
      );
      console.log("Response to inquiry submitted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error responding to inquiry:", error);
      throw error;
    }
  }

  async updateInquiryStatus(inquiryId, statusDto) {
    try {
      const response = await axios.put(
        API_URL + `inquiries/${inquiryId}/status`,
        statusDto
      );
      console.log("Inquiry status updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating inquiry status:", error);
      throw error;
    }
  }
}

export default new CorrespondenceService();
