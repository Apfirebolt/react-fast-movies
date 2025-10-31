import React, { useState } from "react";
import useAuthStore from "../stores/auth";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from '../assets/logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login({ email, password })
      .then(() => {
        // Redirect to dashboard or home page
      })
      .catch((error) => {
        console.error("Login failed:", error.data);
      });
  };

  return (
    <div className="flex items-center justify-center bg-neutral-100">
      <motion.div
        className="w-full max-w-xxl bg-white rounded shadow-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-center text-light py-2 px-1 bg-tertiary">
          LOGIN
        </h2>
        <div className="flex justify-center py-4">
          <img
            src="https://static.vecteezy.com/system/resources/previews/041/731/156/non_2x/login-icon-vector.jpg"
            alt="Login Icon"
            className="w-36 h-32 rounded-full shadow-md"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-tertiary rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Login
              </button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-tertiary hover:underline">
                Sign up
              </a>
            </p>
          </div>
          <div>
            <img src={Logo} alt="Company Logo" className="logo" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
