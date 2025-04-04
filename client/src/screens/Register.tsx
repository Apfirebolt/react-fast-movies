import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // Import icons
import useAuthStore from "../stores/auth";
import { motion } from "framer-motion"; // Import motion for animations

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ username, email, password })
      .then(() => {
        console.log("Registration successful");
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <motion.div className="w-full max-w-md p-8 bg-white rounded shadow-md"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
        <label
          htmlFor="username"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <div className="flex items-center border rounded-md">
          <FaUser className="ml-3 text-gray-500" />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 shadow-lg rounded-xl focus:outline-none"
            placeholder="Enter your username"
            required
          />
        </div>
          </div>
          <div className="mb-4">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="flex items-center border rounded-md">
          <FaEnvelope className="ml-3 text-gray-500" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 shadow-lg rounded-xl focus:outline-none"
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
        <div className="flex items-center border rounded-md">
          <FaLock className="ml-3 text-gray-500" />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </div>
          </div>
          <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
        Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
        Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
