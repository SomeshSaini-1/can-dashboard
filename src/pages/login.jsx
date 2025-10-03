import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login_data, setLoginData] = useState({
    loginid: "",
    password: ""
  });

  const handleLogin = (e) => {
    e.preventDefault();

    if (login_data.loginid === "Admin" && login_data.password === "123") {
      dispatch(login());
      navigate("/Home");
    } else {
      alert("Invalid credentials.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo1.png"
            alt="Intangles Logo"
            className="h-16 mb-2"
          />
          <h2 className="text-xl font-semibold text-gray-700">
            Welcome to Oxymora
          </h2>
          <p className="text-sm text-gray-500">Log in</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            name="loginid"
            value={login_data.loginid}
            onChange={handleInputChange}
            placeholder="Login Id"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <input
              type="password"
              name="password"
              value={login_data.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* <span className="absolute right-3 top-2.5 text-gray-400 cursor-pointer">
              👁️
            </span> */}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="otp"
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="otp" className="text-sm text-gray-600">
              Keep me signed in 
            </label>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By logging in, you confirm that you have read, understood and accept the{" "}
            <span className="text-blue-600 underline cursor-pointer">Privacy Notice</span>{" "}
            and{" "}
            <span className="text-blue-600 underline cursor-pointer">Terms & Conditions</span>.
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
          >
            Login
          </button>

          <div className="text-center">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
