
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  // withCredentials: true, // Crucial for receiving/sending httpOnly cookies
 headers: {
  'Content-Type': 'application/json'
}
});

// ---------------------------------------------
// Refresh Token Handling Logic
// ---------------------------------------------

let isRefreshing = false;
let waitingRequests = [];

// Helper to process the queue once the token is refreshed
function resolveWaitingRequests() {
  waitingRequests.forEach((callback) => callback());
  waitingRequests = [];
}

api.interceptors.response.use(
  // Success path: just return the response
  (response) => response,
  
  // Error path: handle 401 Unauthorized
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token") &&
      !originalRequest.url.includes("/auth/login") // Don't refresh if login fails
    ) {
      originalRequest._retry = true;

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          waitingRequests.push(() => {
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Attempt to refresh the session
        await api.post("/auth/refresh-token");
        
        isRefreshing = false;
        resolveWaitingRequests();

        // Retry the original request that failed
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        waitingRequests = []; // Clear queue on failure

        // If refresh fails, the user session is dead. Redirect to login.
        if (typeof window !== "undefined") {
          localStorage.removeItem('user'); // Clean up local state
          localStorage.removeItem('isAdmin');
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // For all other errors (404, 500, etc.), just reject
    return Promise.reject(error);
  }
);

export default api;