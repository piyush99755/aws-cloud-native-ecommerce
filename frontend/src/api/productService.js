import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Fetch products from backend
 * - token: optional, required for signed-in users
 */
export const getProducts = async (token = null) => {
  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` }  // Authenticated user
      : {};                                   // Guest mode

    const response = await axios.get(`${API_URL}/api/products`, { headers });
    return response.data; // return only the data
  } catch (err) {
    console.error("Error fetching products:", err.response || err.message);
    throw err;
  }
};

/**
 * Fetch orders for authenticated user
 */
export const getOrders = async (token) => {
  if (!token) throw new Error("Token required to fetch orders");

  try {
    const response = await axios.get(`${API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching orders:", err.response || err.message);
    throw err;
  }
};


