import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllBooksAPI,fetchBookById , createBookAPI } from "./bookAPI";

// Async Thunks
export const getAllBooks = createAsyncThunk("books", async (thunkAPI) => {
  try {
    const res = await getAllBooksAPI();
    toast.success("Books are retrieved successfully");
    return res;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to retrieve books");
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});
export const getSingleBook = createAsyncThunk(
  "books/getSingleBook",
  async (id, thunkAPI) => {
    try {
      const response = await fetchBookById(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch book");
    }
  }
);


export const createBook = createAsyncThunk(
  "books/createBook",
  async (formData, thunkAPI) => {
    try {
      const res = await createBookAPI(formData);
      toast.success("Book created successfully!");
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create book");
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create book");
    }
  }
);



const initialState = {
  allBooks : [],
  singleBook: null,
  isLoading: true,
  error: null,
  success: null,
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
       // All books logic here
      .addCase(getAllBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allBooks = action.payload.data;
      })
      .addCase(getAllBooks.rejected, (state) => {
        state.isLoading = false;
      })


       // Single book logic
      .addCase(getSingleBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSingleBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleBook = action.payload.data;
      })
      .addCase(getSingleBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.err;
      })

      //createing the book
      .addCase(createBook.pending, (state) => {
        state.isLoading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = "Book created successfully!";
        state.allBooks.unshift(action.payload.data); // optionally add new book to list
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
      
  },
});
export default bookSlice.reducer;