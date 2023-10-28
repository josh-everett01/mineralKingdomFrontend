import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7240/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json', 'Content-Type': 'application/json'
  }
})

export default {
  login(credentials) {
    return apiClient.post('/User/login', credentials)
  }
}