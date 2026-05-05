import axios from "axios";
import { store } from "../redux-store/store";
import { setToken, logout } from "../redux-store/authSlice";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance with default config for all API requests
// withCredentials: true enables sending/receiving HttpOnly cookies automatically
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // This allows axios to send and receive HttpOnly cookies
});

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest &&
      !originalRequest._retry &&
      error.response &&
      [401, 403].includes(error.response.status) &&
      !originalRequest.url.includes("/api/login") &&
      !originalRequest.url.includes("/api/refresh") &&
      !originalRequest.url.includes("/api/logout")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${baseURL}/api/refresh`,
          null,
          { withCredentials: true },
        );

        const newToken = refreshResponse.data.accessToken;
        if (newToken) {
          store.dispatch(setToken(newToken));
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
