// src/store/modules/cart.js
import CartService from "../../services/CartService";
import MineralService from '../../services/MineralService';

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
    console.log(state);
    console.log(itemId);
    state.items = state.items.filter((item) => item.mineralId !== itemId);
  },
  CLEAR_CART(state) {
    state.items = [];
  },
};

const actions = {
  setCartItems({ commit }, cartItems) {
    commit('SET_CART_ITEMS', cartItems);
  },
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
  async removeItem({ commit }, payload) {
    console.log(payload);
    const { userId, cartItemId } = payload;
    // if (!userId || !cartItemId) {
    //   console.error("userId or cartItemId is missing");
    //   return;
    // }
    try {
      console.log("UserID: " + userId);
      console.log("ItemId: " + cartItemId);
      commit("REMOVE_ITEM", cartItemId);
      await CartService.removeItemFromCart(userId, cartItemId);
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
      const cartData = await CartService.getCartWithItemsByUserId(userId);
      console.log("Cart Data: " + cartData);
      commit("SET_CART_ITEMS", cartData.cartItems);
      console.log("Cart Data: " + cartData);
    } catch (error) {
      console.error("Failed to fetch cart by user ID:", error);
    }
  },
  async calculateTotal(items) {
    let total = 0;
    console.log(items)
    for (const item of items) {
      console.log(item);
      const mineralWithPrice = await MineralService.getMineral(item.mineralId);
      total += parseFloat(mineralWithPrice.price) || 0;
    }
    return total.toFixed(2);
  }

};

const getters = {
  cartItems: (state) => state.items,
  cartTotal: async (state) => {
    if (state.items.length === 0) {
      return "0.00";
    }
    return await this.calculateTotal(state.items);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
