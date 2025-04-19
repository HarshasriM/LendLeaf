// src/features/auth/authAPI.js
import axios from '../../services/axios.js';


export const loginUserAPI = async (userData) => {
  const response = await axios.post('/api/auth/signin', userData);
  console.log(response.data)
  return response.data;
  
};
export const registerUserAPI = async (userData)=>{
  const response = await axios.post('/api/auth/signup', userData);
  return response.data;
}
export const logoutUserAPI = async ()=>{
  const response = await axios.post('/api/auth/signout');
  return response.data;
}
export const verifyOtp = async (otpData) => {
  const response = await axios.post(`api/auth/verifyotp`, otpData);
  return response.data;
}

