import axios from '../../services/axios.js';
export const getAllBooksAPI = async () => {
    const response = await axios.get('/api/books');
    return response.data;
  };