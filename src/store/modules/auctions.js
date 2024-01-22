// src/store/modules/auctions.js
import AuctionService from "../../services/AuctionService";
import Vue from 'vue';

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
  UPDATE_AUCTION_BID(state, { auctionId, newBid }) {
    const auctionIndex = state.auctions.findIndex(a => a.id === auctionId);
    if (auctionIndex !== -1) {
      const auction = state.auctions[auctionIndex];
      auction.currentHighestBid = newBid;
      auction.bidCount++; // Increment the bid count
      Vue.set(state.auctions, auctionIndex, auction); // Ensure reactivity
    }
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
  handleWebSocketMessage({ commit }, message) {
    if (message.type === 'NEW_BID' && message.data) {
      commit('UPDATE_AUCTION_BID', {
        auctionId: message.data.auctionId,
        newBid: message.data.newBid,
      });
    }
  }
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
