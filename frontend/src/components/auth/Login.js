import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setCredentials } from "../../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
        e.preventDefault();
        const resultAction = dispatch(loginUser(formData));
        if (loginUser.fulfilled.match(resultAction)) {
          dispatch(setCredentials(resultAction))
        }
        navigate("/");
   };
    

  return (
    <div className="p-10 sm:p-20 flex items-center flex-col">
      <Typography 
        variant="h4"
        gutterBottom
        sx={{
          color: "#9333ea",
          fontFamily: '"Anton", sans-serif',
          fontWeight: 600,
          fontSize: { xs: '30px', md: '40px' },
          textShadow: '0px 4px 10px rgba(0,0,0,0.2)',
          textAlign: "start",
          marginBottom: '20px'
        }}
      >
        Login
      </Typography>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 gap-x-2">
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email Address
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className=" w-96 rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:ring-2 focus:ring-custom-green-light sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                autoComplete="current-password"
                className=" w-96 rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:ring-2 focus:ring-custom-green-light sm:text-sm"
              />
            </div>
          </div>

          <div className="col-span-full mt-2">
            <button
              type="submit"
              className="px-6 py-3 font-bold text-md text-white bg-secondary rounded-full hover:shadow-lg hover:shadow-primary"
            >
              Login
            </button>
          </div>

          <div className="sm:col-span-2">
            <b>Don't have an account?</b>{' '}
            <Link to="/register" className="text-secondary font-bold text-md">Sign Up</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
