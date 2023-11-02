import axios from 'axios';
import store from './store/index';  // Adjust the path as necessary to import your Vuex store

axios.interceptors.request.use(async (config) => {
  const user = store.getters.getUser;
  if (user && user.jwtToken) {
    const expirationTime = new Date(user.jwtTokenExpiryTime);
    if (expirationTime < new Date()) {
      await store.dispatch('refreshToken');
    }
    config.headers.Authorization = `Bearer ${store.getters.getUser.jwtToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axios;