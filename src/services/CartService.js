// services/CartService.js

import axios from "axios";
import store from "../store/index"; // Import Vuex store if you want to dispatch actions or commit mutations
// import { notifyUser } from '../utils/notifications'; // hypothetical notification utility

const API_URL = "https://localhost:7240/api/shoppingcart/";

class CartService {
  async getCartByUserId(userId) {
    try {
      const response = await axios.get(API_URL + userId);
      // Dispatch action to update cart items in the store
      store.commit("cart/SET_CART_ITEMS", response.data.cartItems);
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to fetch cart");
    }
  }

  async getCartWithItemsByUserId(userId) {
    try {
      const response = await axios.get(API_URL + "withitems/" + userId);
      return response.data;
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
        id: userId, // Ensure this is an integer
        mineralId: item, // Ensure this is an integer without leading zeros
      };
      console.log(cartItemDTO.mineralId);
      const response = await axios.post(
        API_URL + userId + "/items",
        cartItemDTO // Pass the cartItemDTO here
      );
      // Dispatch action to add item to cart in the store
      store.dispatch("cart/addToCart", cartItemDTO);
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to add item to cart");
    }
  }

  async removeItemFromCart(userId, cartItemId) {
    try {
      const response = await axios.delete(
        API_URL + userId + "/items/" + cartItemId
      );
      // notifyUser("Item removed from cart successfully");
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
