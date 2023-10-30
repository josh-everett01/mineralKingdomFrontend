// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import minerals from "../store/modules/minerals";
import MineralService from '../services/MineralService';

Vue.use(Vuex)

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
    async fetchMineral({ commit }, mineralId) {
      try {
        commit('SET_LOADING', true);
        const mineral = await MineralService.getMineral(mineralId);
        commit('SET_CURRENT_MINERAL', mineral);
      } catch (error) {
        console.error('Error fetching mineral:', error);
        commit('SET_ERROR', 'Failed to load mineral');
      } finally {
        commit('SET_LOADING', false);
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
      return state.registrationMessage
    },
  },
  plugins: [createPersistedState()] // Use the plugin to persist state
});
