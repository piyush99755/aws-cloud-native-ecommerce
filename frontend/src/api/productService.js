import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Axios instance with JWT handling
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor: attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle invalid/missing tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized: token invalid or missing");
      localStorage.removeItem("jwtToken");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch products
 */
export const getProducts = async () => {
  try {
    const response = await api.get("/api/products");
    const data = response.data;

    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.products)) return data.products;

    console.warn("Unexpected products API response format:", data);
    return [];
  } catch (err) {
    console.error("Error fetching products:", err.response || err.message);
    return [];
  }
};

/**
 * Fetch orders (auth-only)
 */
export const getOrders = async () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("Token required to fetch orders");

  try {
    const response = await api.get("/api/orders");
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error("Error fetching orders:", err.response || err.message);
    throw err;
  }
};

/**
 * Checkout (auth-only)
 * Sends cart items and returns order confirmation
 */
export const checkout = async (cartItems) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("Token required for checkout");

  try {
    // Only send non-sensitive data
    const payload = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const response = await api.post("/api/checkout", payload);
    return response.data; // could be order ID, status, etc.
  } catch (err) {
    console.error("Checkout failed:", err.response || err.message);
    throw err;
  }
};
