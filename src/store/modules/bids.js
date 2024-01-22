import BidService from "../../services/BidService.js";
import UserService from "../../services/UserService";
import Vue from 'vue';

const state = {
  bids: [],
  highestBid: null,
};

const mutations = {
  SET_BIDS(state, bids) {
    state.bids = bids;
  },
  ADD_BID(state, bid) {
    state.bids = [...state.bids, bid]; // This ensures reactivity
  },
  SET_HIGHEST_BID(state, bid) {
    state.highestBid = bid;
  },
  CLEAR_BIDS(state) {
    state.bids = [];
    state.highestBid = null;
  },
  SET_WINNING_BID(state, winningBid) {
    state.highestBid = winningBid;
  },
  SET_WINNING_BID_WITH_USER(state, winningBidWithUser) {
    console.log("Setting winning bid with user:", winningBidWithUser);
    state.winningBidWithUser = winningBidWithUser;
  },
  updateBid(state, newBid) {
    // Find and update the bid or add it if it doesn't exist
    const bidIndex = state.bids.findIndex(bid => bid.id === newBid.id);
    if (bidIndex !== -1) {
      Vue.set(state.bids, bidIndex, newBid);
    } else {
      state.bids.push(newBid);
    }
  },
};

const actions = {
  async fetchBids({ commit }, auctionId) {
    try {
      const bids = await BidService.getBidsForAuction(auctionId);
      console.log("WE HAVE BIDS: " + bids)
      commit('SET_BIDS', bids);
    } catch (error) {
      console.error("Error fetching bids:", error);
      // Handle error (e.g., show notification, set error state)
    }
  },
  async addBid({ commit, dispatch }, { bidData, auctionId }) {
    try {
      const newBid = await BidService.createBid(bidData);
      console.log("ADDING BID: " + newBid)
      commit('ADD_BID', newBid);
      dispatch('updateHighestBid', auctionId);
      // Optionally, fetch updated bids list if needed
      // dispatch('fetchBids', auctionId);
    } catch (error) {
      console.error("Error creating bid:", error);
      // Handle error (e.g., show notification, set error state)
    }
  },
  async updateHighestBid({ commit }, auctionId) {
    try {
      const highestBid = await BidService.getCurrentWinningBidForAuction(auctionId);
      console.log("HIGHEST BID: " + highestBid.id)
      commit('SET_HIGHEST_BID', highestBid);
    } catch (error) {
      console.error("Error fetching current highest bid:", error);
      // Handle error (e.g., show notification, set error state)
    }
  },

  // In your Vuex store (bids.js)
  async fetchWinningBidForCompletedAuction({ commit }, auctionId) {
    try {
      const winningBidResponse = await BidService.getWinningBidForCompletedAuction(auctionId);
      console.log("Winning bid for completed auction:", winningBidResponse);
      if (winningBidResponse.isSuccess && winningBidResponse.winningBid) {
        const userId = winningBidResponse.winningBid.userId;
        if (userId) {
          const userResponse = await UserService.getUserById(userId);
          console.log("User data fetched for winning bid:", userResponse);
          // Combine the winning bid and user data
          const winningBidWithUser = {
            ...winningBidResponse.winningBid,
            user: userResponse,
          };
          // Commit the combined data to the Vuex store
          commit('SET_WINNING_BID_WITH_USER', winningBidWithUser);
        }
      }
    } catch (error) {
      console.error("Error fetching winning bid for completed auction:", error);
    }
  },

  handleWebSocketMessage({ commit }, message) {
    if (message.Type === "NEW_BID") {
      commit('updateBid', message.data); // assuming 'updateBid' is the mutation
    }
    // ... handle other message types ...
  },
};

const getters = {
  allBids: (state) => state.bids,
  highestBid: (state) => state.highestBid,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
