import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { verifyUserOtp } from "../../features/auth/authSlice.js";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  console.log(email)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = dispatch(verifyUserOtp({ email, otp }));

      if (verifyUserOtp.fulfilled.match(resultAction)) {
        toast.success("OTP verified successfully!")
        navigate("/login");
      } else {
        toast.error(resultAction.payload?.message || "OTP verification failed.");
      }
    } catch (error) {
      toast.error("Something went wrong during OTP verification.");
    }
  };

  return (
    <div className="p-20">
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#198a76",
          fontFamily: '"Anton", sans-serif',
          fontWeight: 600,
          fontSize: { xs: "30px", md: "40px" },
          textShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          fontStyle: "normal",
          margin: "30px 0px",
          textAlign: "start",
        }}
      >
        Verify OTP
      </Typography>

      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="otp" className="block text-sm/6 font-medium text-gray-900">
                  Enter the OTP sent to {email}
                </label>
                <div className="mt-2">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    autoComplete="one-time-code"
                    placeholder="Enter your OTP"
                    className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-custom-green-light sm:text-sm"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <button
                  type="submit"
                  className="px-6 py-3 font-bold text-md text-white bg-secondary rounded-full hover:shadow-lg hover:shadow-primary"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;