// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate' // Import the plugin

Vue.use(Vuex)

export default new Vuex.Store({
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
  },
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user)
    },
    setRegistrationMessage({ commit }, message) {
      console.log("Setting registration message:", message);
      commit('SET_REGISTRATION_MESSAGE', message)
    },
    clearRegistrationMessage({ commit }) {
      console.log("Clearing registration message");
      commit('CLEAR_REGISTRATION_MESSAGE')
    },
    logout({ commit }) {
      commit('SET_USER', null)
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
      return state.registrationMessage
    },
  },
  plugins: [createPersistedState()] // Use the plugin to persist state
});
