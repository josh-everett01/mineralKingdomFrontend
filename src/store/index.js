// src/store/index.js
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import minerals from "../store/modules/minerals";
import MineralService from "../services/MineralService";
import AuthService from "../services/AuthService";
import router from "../router";

const vuexLocalStorage = createPersistedState({
  key: "MineralKingdomStoreAndAuctionHouse", // choose a unique key name to avoid conflicts with other apps
  storage: window.localStorage,
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    minerals,
  },
  state: {
    user: null,
    registrationMessage: null,
  },
  mutations: {
    SET_USER(state, user) {
      console.log("Setting user:", user);
      state.user = user;
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
        if (location.pathname !== "/home") {
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
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    getUser(state) {
      return state.user;
    },
    getRegistrationMessage(state) {
      return state.registrationMessage;
    },
    getAuthToken(state) {
      console.log("Vuex State:", state);
      console.log("Auth Token:", state.user ? state.user.jwtToken : null);
      return state.user ? state.user.jwtToken : null;
    },
  },
});
