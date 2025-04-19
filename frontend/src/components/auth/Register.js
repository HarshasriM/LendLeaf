import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { registerUser, setCredentials } from "../../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        colony: '',
        city: '',
        district: '',
        state: '',
        country: '',
    });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
        dispatch(setCredentials(resultAction))
        const email = formData.email;
        navigate(`/verify-otp?email=${email}`);
    }
  };

  return (
    <div className='px-10 sm:px-20'>
      <Typography
        variant="h4"
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
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 gap-x-2">
          {[
            { label: 'First Name', name: 'firstName' },
            { label: 'Last Name', name: 'lastName' },
            { label: 'Email Address', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Colony', name: 'colony' },
            { label: 'City', name: 'city' },
            { label: 'District', name: 'district' },
            { label: 'State', name: 'state' },
            { label: 'Country', name: 'country' }
          ].map(({ label, name, type = 'text' }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-900">
                {label}
              </label>
              <div className="mt-1">
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label}`}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-custom-green-light sm:text-sm"
                />
              </div>
            </div>
          ))}

          <div className="col-span-full">
            <button
              type="submit"
              className="px-6 py-3 font-bold text-md text-white bg-secondary rounded-full hover:shadow-lg hover:shadow-primary"
            >
              Sign Up
            </button>
          </div>
          <div className="sm:col-span-2">
            <b>Already have an account?</b>{' '}
            <Link to="/login" className="text-secondary font-bold text-md">Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
