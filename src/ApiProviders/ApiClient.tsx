import axios from 'axios';
import { API_BASE_URL } from './ApiConfig';
import store from '../Redux/Store';

const ApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10s timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add request interceptor to attach token dynamically
ApiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.authToken.AUTH_TOKEN;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default ApiClient;