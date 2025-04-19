import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserAPI } from "./authAPI";
import { logoutUserAPI } from "./authAPI";
import { registerUserAPI } from "./authAPI";
import { verifyOtp } from "./authAPI";
import { toast } from "react-toastify";

// Async Thunks
export const registerUser = createAsyncThunk("auth/register", async (formData, thunkAPI) => {
  try {
    const res = await registerUserAPI(formData);
    toast.success("Registered successfully!");
    return res;
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration failed");
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const loginUser = createAsyncThunk("auth/login", async (formData, thunkAPI) => {
  try {
    const res = await loginUserAPI(formData);
    toast.success("Login successful!");
    return res;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const logoutUser = createAsyncThunk("auth/signout", async () => {
  await logoutUserAPI();
});
export const verifyUserOtp = createAsyncThunk("auth/verifyotp",async (formData,thunkAPI)=>{
  try{
    const res = await verifyOtp(formData)
    toast.success("Otp verified successfully");
    return res;
  }
  catch(error){
    toast.error(error.response?.data?.message || "otp verfication failed");
    return thunkAPI.rejectWithValue(error.response?.data);
  }
})

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.data;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.data));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user"); // Remove user from localStorage on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, state => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.data));
      })
      .addCase(registerUser.rejected, state => { state.isLoading = false; })

      .addCase(loginUser.pending, state => { state.isLoading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.data));
      })
      .addCase(loginUser.rejected, state => { state.isLoading = false; })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(verifyUserOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyUserOtp.fulfilled, (state) => {
        state.isLoading =false;
        state.otpVerified = true;
      })
      .addCase(verifyUserOtp.rejected, (state) => {
        state.isLoading = false;
        state.otpVerified = false;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
