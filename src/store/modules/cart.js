// src/store/modules/cart.js
import CartService from "../../services/CartService";

const state = {
  items: [], // Array to hold cart items
};

const mutations = {
  ADD_TO_CART(state, item) {
    state.items.push(item);
  },
  SET_CART_ITEMS(state, items) {
    state.items = items;
  },
  REMOVE_ITEM(state, itemId) {
    state.items = state.items.filter((item) => item.id !== itemId);
  },
  CLEAR_CART(state) {
    state.items = [];
  },
};

const actions = {
  async addToCart({ commit }, { userId, item }) {
    try {
      console.log(item);
      await CartService.addItemToCart(userId, item.id);
      commit("ADD_TO_CART", item);
      console.log(item);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  },
  async removeItem({ commit }, { userId, itemId }) {
    try {
      await CartService.removeItemFromCart(userId, itemId);
      commit("REMOVE_ITEM", itemId);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  },
  async clearCart({ commit }) {
    try {
      commit("CLEAR_CART");
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  },
  async getCartByUserId({ commit }, userId) {
    try {
      console.log(userId);
      const cartData = await CartService.getCartByUserId(userId);
      commit("SET_CART_ITEMS", cartData.cartItems);
      console.log("Cart Data: " + cartData);
    } catch (error) {
      console.error("Failed to fetch cart by user ID:", error);
    }
  },
};

const getters = {
  cartItems: (state) => state.items,
  cartTotal: (state) => {
    return state.items.reduce((total, item) => {
      return total + (parseFloat(item.price) || 0);
    }, 0);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
