import CorrespondenceService from "../../services/CorrespondenceService";

export default {
  namespaced: true,
  state: {
    inquiries: [],
    responses: [],
    loading: false,
    error: null,
    adminId: null,
  },
  mutations: {
    SET_INQUIRIES(state, inquiries) {
      state.inquiries = inquiries;
    },
    ADD_INQUIRY(state, inquiry) {
      state.inquiries.push(inquiry);
    },
    SET_RESPONSES(state, responses) {
      state.responses = responses;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_ADMIN_ID(state, adminId) {
      state.adminId = adminId;
    },
    REMOVE_INQUIRY(state, inquiryId) {
      state.inquiries = state.inquiries.filter(
        (inquiry) => inquiry.id !== inquiryId
      );
    },
  },
  actions: {
    async submitInquiry({ commit }, inquiryData) {
      try {
        commit("SET_LOADING", true);
        const inquiry = await CorrespondenceService.submitInquiry(inquiryData);
        commit("ADD_INQUIRY", inquiry);
        commit("SET_ERROR", null);
      } catch (error) {
        console.error("Error submitting inquiry:", error);
        commit("SET_ERROR", "Failed to submit inquiry");
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async fetchInquiriesByCustomer({ commit }, customerId) {
      try {
        commit("SET_LOADING", true);
        const inquiries = await CorrespondenceService.getInquiriesByCustomer(
          customerId
        );
        commit("SET_INQUIRIES", inquiries);
        commit("SET_ERROR", null);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        commit("SET_ERROR", "Failed to load inquiries");
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async fetchAllInquiries({ commit }) {
      try {
        commit("SET_LOADING", true);
        const inquiries = await CorrespondenceService.getAllInquiries();
        commit("SET_INQUIRIES", inquiries);
        commit("SET_ERROR", null);
      } catch (error) {
        console.error("Error fetching all inquiries:", error);
        commit("SET_ERROR", "Failed to load all inquiries");
      } finally {
        commit("SET_LOADING", false);
      }
    },
    setAdminId({ commit }, adminId) {
      commit("SET_ADMIN_ID", adminId);
    },
    removeInquiry({ commit }, inquiryId) {
      commit("REMOVE_INQUIRY", inquiryId);
    },
  },
  getters: {
    inquiries: (state) => state.inquiries,
    responses: (state) => state.responses,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
    getAdminId: (state) => {
      // Return the admin's user ID from the state
      return state.adminId;
    },
  },
};
