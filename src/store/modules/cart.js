// src/store/modules/cart.js
import CartService from "../../services/CartService";
import MineralService from "../../services/MineralService";

const state = {
  items: [], // Array to hold cart items
  total: "0.00",
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
  UPDATE_ITEM_PRICE(state, updatedPrice) {
    const itemIndex = state.items.findIndex(item => item.mineralId === updatedPrice.itemId);
    if (itemIndex !== -1) {
      state.items[itemIndex].price = updatedPrice.price;
    }
  },
  SET_TOTAL(state, total) {
    state.total = total;
  },
};

const actions = {
  setCartItems({ commit }, cartItems) {
    console.log("SET CART ITEMS called!: " + cartItems);
    commit("SET_CART_ITEMS", cartItems);
  },
  async addToCart({ commit }, { userId, item }) {
    console.log("Attempting to add to cart:", item);
    if (item && item.id && (await MineralService.mineralExists(item.id))) {
      item.mineralId = item.id; // Set mineralId to id
      console.log("Adding item to cart:", item);
      await CartService.addItemToCart(userId, item.mineralId);
      commit("ADD_TO_CART", item);
    } else {
      console.error(
        "Invalid item, missing id, or mineral does not exist:",
        item
      );
    }
  },
  async removeItem({ commit }, payload) {
    console.log(payload);
    const { userId, cartItemId } = payload;

    if (!userId || !cartItemId) {
      console.error("userId or cartItemId is missing");
      return;
    }

    try {
      console.log("UserID: " + userId);
      console.log("ItemId: " + cartItemId);
      await CartService.removeItemFromCart(userId, cartItemId);
      commit("REMOVE_ITEM", cartItemId);
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
  updateItemPrice({ commit }, updatedPrice) {
    commit("UPDATE_ITEM_PRICE", updatedPrice);
  },
  async calculateTotal({ commit, state }) {
    let total = 0;
    for (const item of state.items) {
      total += parseFloat(item.price) || 0;
    }
    commit('SET_TOTAL', total.toFixed(2));
  },
};

const getters = {
  cartItems: (state) => state.items,
  calculateTotal: (state) => async () => {
    let total = 0;
    for (const item of state.items) {
      const mineralWithPrice = await MineralService.getMineral(item.mineralId);
      total += parseFloat(mineralWithPrice.price) || 0;
    }
    return total.toFixed(2);
  },
  cartTotal: (state) => state.total,
  isItemInCart: (state) => (userId, mineralId) => {
    return state.items.some(item => item.userId === userId && item.mineralId === mineralId);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
