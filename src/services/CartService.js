// services/CartService.js

import axios from "axios";
// import store from "../store/index"; // Import Vuex store if you want to dispatch actions or commit mutations
// import { notifyUser } from '../utils/notifications'; // hypothetical notification utility

const API_URL = "https://localhost:7240/api/shoppingcart/";

class CartService {
  async getCartByUserId(userId) {
    try {
      console.log("UserID during getCartByUserId: " + userId);
      console.log("String being used: " + API_URL + userId);
      const response = await axios.get(API_URL + userId);
      console.log("Users Cart: " + response.data.id);
      console.log("From Get Cart2: " + response.data.id);
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to fetch cart");
    }
  }

  async getCartWithItemsByUserId(userId) {
    try {
      console.log("UserID from getCartWithItemsByUserId: " + userId);
      // await this.getCartByUserId(userId);
      const response = await axios.get(API_URL + "withitems/" + userId);
      console.log("From Get Cart: " + response.data.cartItems);
      return response.data.cartItems;
    } catch (error) {
      this.handleError(error, "Failed to fetch cart with items");
    }
  }

  async createCartForUser(userId) {
    try {
      const response = await axios.post(API_URL + "create/" + userId);
      // notifyUser("Cart created successfully"); // If you have a notification system
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to create cart");
    }
  }

  async updateCart(cartDto) {
    try {
      const response = await axios.put(API_URL + "update", cartDto);
      // notifyUser("Cart updated successfully");
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to update cart");
    }
  }

  async deleteCart(cartId) {
    try {
      const response = await axios.delete(API_URL + cartId);
      // notifyUser("Cart deleted successfully");
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to delete cart");
    }
  }

  async addItemToCart(userId, item) {
    try {
      console.log("UserId: " + userId);
      console.log(item);
      const cartItemDTO = {
        id: userId,
        mineralId: item,
      };
      console.log(cartItemDTO.mineralId);
      const response = await axios.post(
        API_URL + userId + "/items",
        cartItemDTO
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to add item to cart");
    }
  }

  async removeItemFromCart(userId, cartItemId) {
    try {
      // Construct the URL for the DELETE request
      const url = `${API_URL}${userId}/items/${cartItemId}`;

      // Perform the DELETE request
      const response = await axios.delete(url);

      // Return the response data
      console.log(response.data);
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to remove item from cart");
    }
  }

  handleError(error, defaultMessage) {
    const message = error.response?.data?.message || defaultMessage;
    console.error(message);
    throw new Error(message);
  }
}

export default new CartService();
