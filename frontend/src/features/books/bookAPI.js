import axios from '../../services/axios.js';
export const getAllBooksAPI = async () => {
    const response = await axios.get('/api/books');
    return response.data;
  };
export const fetchBookById = async (id) => {
    const response = await axios.get(`api/books/${id}`);
    return response.data;
};