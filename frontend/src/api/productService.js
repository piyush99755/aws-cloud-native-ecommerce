import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
console.log("Loaded BASE_URL:", process.env.REACT_APP_BACKEND_URL);


export const getProducts = async(token) => {
  return axios.get(`${BASE_URL}/products`,{
    headers: {
        Authorization: `Bearer ${token}`
    },
  });
};
