// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user)
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user
    },
    getUser(state) {
      return state.user
    }
  }
})
