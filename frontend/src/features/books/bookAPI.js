import axios from '../../services/axios.js';


export const getAllBooksAPI = async () => {
    const response = await axios.get('/api/books');
    return response.data;
  };
export const fetchBookById = async (id) => {
    const response = await axios.get(`api/books/${id}`);
    return response.data;
};
export const createBookAPI = async (formData) => {
  const res = await axios.post("/api/books/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true, // if you're using cookies
  });
  return res.data;
};