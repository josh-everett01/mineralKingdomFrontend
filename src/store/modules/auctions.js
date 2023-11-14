// src/store/modules/auctions.js
import AuctionService from "../../services/AuctionService";

const state = {
  auctions: [],
  loading: false,
  error: null,
};

const mutations = {
  SET_AUCTIONS(state, auctions) {
    state.auctions = auctions;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchAuctions({ commit }) {
    commit("SET_LOADING", true);
    try {
      const auctions = await AuctionService.getAuctions();
      commit("SET_AUCTIONS", auctions);
      commit("SET_ERROR", null);
    } catch (error) {
      commit("SET_ERROR", "Failed to load auctions");
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const getters = {
  allAuctions: (state) => state.auctions,
  isLoading: (state) => state.loading,
  error: (state) => state.error,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
