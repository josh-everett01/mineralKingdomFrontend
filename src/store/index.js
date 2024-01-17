// src/store/index.js
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import minerals from "../store/modules/minerals";
import auctions from "./modules/auctions";
import cart from "./modules/cart";
import correspondence from "./modules/correspondence";
import MineralService from "../services/MineralService";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";
import router from "../router";

const vuexLocalStorage = createPersistedState({
  key: "MineralKingdomStoreAndAuctionHouse", // choose a unique key name to avoid conflicts with other apps
  storage: window.localStorage,
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    minerals,
    auctions,
    cart,
    correspondence,
  },
  state: {
    user: null,
    registrationMessage: null,
    role: null,
    userPayments: [],
  },
  mutations: {
    SET_USER(state, user) {
      console.log("Setting user:", user);
      state.user = user;
      state.role = user?.userRole;
    },
    SET_REGISTRATION_MESSAGE(state, message) {
      console.log("Mutation - Setting registration message:", message);
      state.registrationMessage = message;
    },
    CLEAR_REGISTRATION_MESSAGE(state) {
      console.log("Mutation - Clearing registration message");
      state.registrationMessage = null;
    },
    RESET_STATE(state) {
      state.minerals = [];
      state.user = null;
    },
    UPDATE_USER_DATA(state, updatedUser) {
      console.log("Mutation - Updating user data:", updatedUser);
      // Update the user data in the state
      state.user = updatedUser;
    },
    SET_USER_PAYMENTS(state, payments) {
      state.userPayments = payments;
    },
  },
  plugins: [vuexLocalStorage],
  actions: {
    setUser({ commit }, user) {
      commit("SET_USER", user);
    },
    setRegistrationMessage({ commit }, message) {
      console.log("Setting registration message:", message);
      commit("SET_REGISTRATION_MESSAGE", message);
    },
    clearRegistrationMessage({ commit }) {
      console.log("Clearing registration message");
      commit("CLEAR_REGISTRATION_MESSAGE");
    },
    async logout({ commit, getters, dispatch }) {
      try {
        const token = getters.getAuthToken;
        console.log("token during logout: " + token);
        await AuthService.logout(token);
        commit("SET_USER", null);
        dispatch("minerals/clearMinerals", null, { root: true });
        // location.reload();
        console.log(location.pathname);
        if (location.pathname != "/home") {
          router.push("/home");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
    async refreshToken({ commit }) {
      try {
        const response = await AuthService.refreshToken();
        commit("SET_USER", response.data);
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    },
    async fetchMineral({ commit }, mineralId) {
      try {
        commit("SET_LOADING", true);
        const mineral = await MineralService.getMineral(mineralId);
        commit("SET_CURRENT_MINERAL", mineral);
      } catch (error) {
        console.error("Error fetching mineral:", error);
        commit("SET_ERROR", "Failed to load mineral");
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async fetchUserPayments({ commit }, userId) {
      try {
        const payments = await UserService.getUserPayments(userId);
        commit("SET_USER_PAYMENTS", payments);
      } catch (error) {
        console.error("Error fetching user payments:", error);
      }
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    getUser(state) {
      return state.user;
    },
    isAdmin(state) {
      return state.user && state.user.userRole === 1;
    },
    isUser(state) {
      return state.user && state.user.userRole === 2;
    },
    getRegistrationMessage(state) {
      return state.registrationMessage;
    },
    getAuthToken(state) {
      console.log("Vuex State:", state);
      console.log("Auth Token:", state.user ? state.user.jwtToken : null);
      return state.user ? state.user.jwtToken : null;
    },
    userPayments(state) {
      return state.userPayments;
    },
  },
});
