import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import bookReducer from "../features/books/bookSlice.js"
 const store = configureStore({
  reducer: {
    auth: authReducer,
    book:bookReducer
    // Add other slices like reviews, requests
  },
});
export default store;
