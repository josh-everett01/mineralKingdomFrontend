import axios from 'axios';

const API_URL = 'https://localhost:7240/api/';

class MineralService {
  async getMinerals() {
    try {
      const response = await axios.get(API_URL + 'Minerals');
      return response.data;
    } catch (error) {
      console.error('Error fetching minerals:', error);
      throw error;
    }
  }
}

export default new MineralService();
