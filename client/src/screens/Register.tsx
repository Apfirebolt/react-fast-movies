import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/auth";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "../assets/logo.png";
import { toast } from "react-toastify";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    try {
      setIsSubmitting(true);
      await register({ username, email, password });
      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (error: any) {
      console.error("Registration failed:", error?.data || error);
      toast.error(
        error?.response?.data?.detail || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Main Register Card */}
      <motion.div
        className="relative z-10 w-full max-w-4xl bg-slate-900/80 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden grid grid-cols-1 md:grid-cols-2"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        
        {/* Left Side: Form Container */}
        <div className="p-8 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Header / Brand with Light Logo Badge */}
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="bg-slate-100 p-1.5 rounded-xl border border-white/20 shadow-sm flex items-center justify-center">
                <img src={Logo} alt="Monstella Logo" className="h-6 w-auto object-contain" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Monstella
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Create Account
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Join Monstella to build custom playlists and organize your movies.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Input */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder-slate-500"
                    placeholder="johndoe"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder-slate-500"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder-slate-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-indigo-950/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <FaUserPlus className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Creating Account..." : "Register Account"}</span>
              </button>
            </form>
          </div>

          {/* Footer Login Link */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Decorative Banner with Light Logo Badge */}
        <div className="hidden md:flex relative bg-slate-950 flex-col items-center justify-center p-10 border-l border-slate-800/80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-950 pointer-events-none" />
          
          <div className="relative z-10 text-center space-y-4 max-w-sm">
            {/* White Background Container for Logo Display */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white p-3.5 border border-slate-200 flex items-center justify-center shadow-xl shadow-indigo-500/10">
              <img src={Logo} alt="Monstella Graphic" className="w-full h-full object-contain" />
            </div>
            
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Start Your Movie Collection
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Create an account to save movies, organize custom playlists, and access personalized recommendations.
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Register;