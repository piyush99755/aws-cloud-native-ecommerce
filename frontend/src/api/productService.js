import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Fetch products from backend
 * Always returns an array ([]), even if API fails or returns unexpected data
 */
export const getProducts = async (token = null) => {
  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` } // Authenticated user
      : {}; // Guest mode

    const response = await axios.get(`${API_URL}/api/products`, { headers });
    const data = response.data;

    // Normalize response: always return an array
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.products)) return data.products;

    // If backend returns unexpected format, log a warning and return empty array
    console.warn("Unexpected products API response format:", data);
    return [];
  } catch (err) {
    console.error("Error fetching products:", err.response || err.message);
    return []; // Fail-safe: return empty array instead of throwing
  }
};

/**
 * Fetch orders for authenticated user
 * Returns an array or throws if token is missing
 */
export const getOrders = async (token) => {
  if (!token) throw new Error("Token required to fetch orders");

  try {
    const response = await axios.get(`${API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error("Error fetching orders:", err.response || err.message);
    throw err;
  }
};
