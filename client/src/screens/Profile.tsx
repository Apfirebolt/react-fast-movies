import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/auth";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCheck, 
  FaKey, 
  FaShieldAlt, 
  FaArrowLeft 
} from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "../assets/logo.png";
import { toast } from "react-toastify";

const ProfileSettings: React.FC = () => {
  const { user } = useAuthStore() as any;

  // Profile Details State
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Update State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Handle General Profile Info
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      toast.warning("Please fill in all profile fields.");
      return;
    }

    try {
      setIsUpdatingProfile(true);
      // await updateProfile({ username, email });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update failed:", error);
      toast.error(
        error?.response?.data?.detail || "Failed to update profile info."
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      // await updatePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password change failed:", error);
      toast.error(
        error?.response?.data?.detail || "Failed to update password. Check your current password."
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-300 font-sans overflow-x-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Main Settings Card */}
      <motion.div
        className="relative z-10 w-full max-w-4xl bg-slate-900/80 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden p-6 sm:p-10"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Top Navigation & Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 p-1.5 rounded-xl border border-white/20 shadow-sm flex items-center justify-center">
              <img src={Logo} alt="Monstella Logo" className="h-6 w-auto object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Account Settings
              </h1>
              <p className="text-xs text-slate-400">
                Manage your credentials and personal Monstella preferences.
              </p>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-800/60 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700/50"
          >
            <FaArrowLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        </div>

        {/* 2-Column Grid Form Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section 1: General Profile Info */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 mb-5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FaUser className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Profile Information
                  </h2>
                  <p className="text-xs text-slate-400">
                    Update your public display handle and active email.
                  </p>
                </div>
              </div>

              <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-4">
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
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder-slate-500"
                      placeholder="Username"
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
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder-slate-500"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            <button
              type="submit"
              form="profile-form"
              disabled={isUpdatingProfile}
              className="w-full mt-6 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-indigo-950/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FaCheck className="w-3.5 h-3.5" />
              <span>{isUpdatingProfile ? "Saving..." : "Save Details"}</span>
            </button>
          </div>

          {/* Section 2: Security & Password */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 mb-5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FaShieldAlt className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Security & Password
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ensure your account uses a secure password.
                  </p>
                </div>
              </div>

              <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder-slate-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder-slate-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder-slate-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            <button
              type="submit"
              form="password-form"
              disabled={isUpdatingPassword}
              className="w-full mt-6 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FaKey className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isUpdatingPassword ? "Updating..." : "Update Password"}</span>
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSettings;