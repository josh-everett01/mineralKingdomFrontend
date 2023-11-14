// src/store/modules/cart.js

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
    state.items = state.items.filter(item => item.id !== itemId);
  },
  CLEAR_CART(state) {
    state.items = [];
  },
};

const actions = {
  addToCart({ commit }, item) {
    commit("ADD_TO_CART", item);
  },
  setCartItems({ commit }, items) {
    commit("SET_CART_ITEMS", items);
  },
  removeItem({ commit }, itemId) {
    commit("REMOVE_ITEM", itemId);
  },
  clearCart({ commit }) {
    commit("CLEAR_CART");
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
