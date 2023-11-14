import MineralService from "../../services/MineralService";

export default {
  namespaced: true,
  state: {
    minerals: [],
    currentMineral: null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_MINERALS(state, minerals) {
      state.minerals = minerals;
    },
    CLEAR_MINERALS(state) {
      state.minerals = [];
      state.currentMineral = null;
    },
    SET_CURRENT_MINERAL(state, mineral) {
      console.log("Setting current mineral:", mineral);
      state.currentMineral = mineral;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchMineral({ commit }, mineralId) {
      try {
        commit("SET_LOADING", true);
        const mineral = await MineralService.getMineral(mineralId);
        console.log("Mineral from module : " + mineral);
        commit("SET_CURRENT_MINERAL", mineral);
        commit("SET_ERROR", null);
      } catch (error) {
        console.error("Error fetching mineral:", error);
        commit("SET_ERROR", "Failed to load mineral");
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async fetchMinerals({ commit }) {
      try {
        commit("SET_LOADING", true);
        const minerals = await MineralService.getMinerals();
        console.log(minerals);
        commit("SET_MINERALS", minerals);
        commit("SET_ERROR", null);
      } catch (error) {
        console.error("Error fetching minerals:", error);
        commit("SET_ERROR", "Failed to load minerals");
      } finally {
        commit("SET_LOADING", false);
      }
    },
    clearMinerals({ commit }) {
      commit("CLEAR_MINERALS");
    },
  },
  getters: {
    availableMinerals: (state) => {
      return state.minerals.filter(
        (mineral) => (mineral.status == 0) & (mineral.isAuctionItem === false)
      );
    },
    currentMineral: (state) => state.currentMineral,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
