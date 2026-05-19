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
  // interceptors.request.use allows us to modify the request before it is sent.
  // Here, we add the Authorization header with the JWT token if it exists in the Redux store.
  const token = store.getState().auth.token;
  // We get the token from the Redux store (store.getState().auth.token). 
  // If the token exists, we add it to the Authorization header of the request in the format "Bearer <token
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    // If the token exists in the Redux store, we add it to the Authorization header of the request in the format "Bearer <token>". 
    // This way, the backend can verify the token and authenticate the user for protected routes.
  }
  return config;
});

axiosInstance.interceptors.response.use(
  // interceptors.response.use allows us to handle responses globally.
  // Here, we check if the response has an error status (401 or 403), and if so, we attempt to refresh the token and retry the original request.
  // If the response is successful, just return it.
  (response) => response,
  async (error) => {
    const originalRequest = error.config;  
    // the original request that caused the error (e.g. GET /api/items)

    if (
      originalRequest &&
      !originalRequest._retry &&
      error.response &&
      [401, 403].includes(error.response.status) &&
      !originalRequest.url.includes("/api/login") &&
      !originalRequest.url.includes("/api/refresh") &&
      !originalRequest.url.includes("/api/logout")
      // We check if the error response status is 401 (Unauthorized) or 403 (Forbidden), which indicates that the token is invalid or expired.
      // api/login, /api/refresh and /api/logout endpoints should not trigger token refresh logic, 
      // because they are related to authentication itself, so we exclude them from this check.
    ) {
      originalRequest._retry = true;
      // If we get a 401 or 403 error, it means the token is invalid or expired. 
      // We then try to refresh the token by making a request to the /api/refresh endpoint:

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
          // After refreshing the token, we update the Authorization header of the original request with the new token, and retry the original request.
        }
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); 
    // If the error is not due to an unauthorized status, or if the token refresh fails, 
    // we just reject the error and let it be handled by the component that made the original request.
  },
);

export default axiosInstance; 
// Export the configured axios instance for use in API calls throughout the app.
