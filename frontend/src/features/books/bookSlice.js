import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllBooksAPI } from "./bookAPI";

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

const initialState = {
   allBooks : [],
   isLoading:false,
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllBooks.pending, state => { state.isLoading = true; })
      .addCase(getAllBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allBooks = action.payload.data
      })
      .addCase(getAllBooks.rejected, state => { state.isLoading = false; })

      
  },
});
export default bookSlice.reducer;