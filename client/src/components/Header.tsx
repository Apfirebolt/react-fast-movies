import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../stores/auth";
import { FaBars, FaChevronDown, FaUser, FaFilm, FaSignOutAlt, FaTimes } from "react-icons/fa";
import Logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<string>("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setSelectedTab("home");
    else if (path === "/about") setSelectedTab("about");
    else if (path === "/dashboard") setSelectedTab("dashboard");
    else if (path === "/login") setSelectedTab("login");
    else if (path === "/register") setSelectedTab("register");
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLinkStyles = (tabName: string) => {
    const baseStyles =
      "text-sm font-semibold transition-all duration-200 hover:text-indigo-400 py-1 border-b-2";
    const activeStyles =
      selectedTab === tabName
        ? "text-indigo-400 border-indigo-500 font-bold"
        : "text-slate-300 border-transparent";
    return `${baseStyles} ${activeStyles}`;
  };

  const getMobileLinkStyles = (tabName: string) => {
    const baseStyles = "block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all";
    const activeStyles =
      selectedTab === tabName
        ? "bg-indigo-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white";
    return `${baseStyles} ${activeStyles}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name with Light Badge Wrapper */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              {/* Light background container for dark/transparent logos */}
              <div className="bg-slate-100 p-1.5 rounded-xl border border-white/20 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src={Logo}
                  alt="Monstella Logo"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                Monstella
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getLinkStyles("home")}>
              Home
            </Link>
            <Link to="/about" className={getLinkStyles("about")}>
              About
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className={getLinkStyles("dashboard")}>
                  Dashboard
                </Link>

                {/* Account & Content Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 text-xs font-semibold transition-all focus:outline-none"
                  >
                    <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] uppercase">
                      {user?.user?.email?.charAt(0) || "U"}
                    </div>
                    <span className="max-w-[120px] truncate">{user?.user?.email}</span>
                    <FaChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        className="absolute right-0 mt-3 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden z-50 text-slate-300"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 space-y-4">
                          
                          {/* User Header */}
                          <div className="border-b border-slate-800/80 pb-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Signed in as
                            </p>
                            <p className="text-xs font-bold text-white truncate mt-0.5">
                              {user?.user?.email}
                            </p>
                          </div>

                          {/* Grid Navigation */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center space-x-1">
                                <FaUser className="w-3 h-3 inline mr-1" />
                                Account
                              </h3>
                              <ul className="space-y-1.5 text-xs">
                                <li>
                                  <Link
                                    to="/profile"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="hover:text-white hover:translate-x-0.5 transition-all block py-1"
                                  >
                                    Profile
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/recommendations"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="hover:text-white hover:translate-x-0.5 transition-all block py-1"
                                  >
                                    Recommendations
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/billing"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="hover:text-white hover:translate-x-0.5 transition-all block py-1"
                                  >
                                    Billing
                                  </Link>
                                </li>
                              </ul>
                            </div>

                            <div>
                              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center space-x-1">
                                <FaFilm className="w-3 h-3 inline mr-1" />
                                Content
                              </h3>
                              <ul className="space-y-1.5 text-xs">
                                <li>
                                  <Link
                                    to="/favorites"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="hover:text-white hover:translate-x-0.5 transition-all block py-1"
                                  >
                                    Favorites
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/watchlist"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="hover:text-white hover:translate-x-0.5 transition-all block py-1"
                                  >
                                    Watchlist
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/history"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="hover:text-white hover:translate-x-0.5 transition-all block py-1"
                                  >
                                    History
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Sign Out Button */}
                          <div className="pt-3 border-t border-slate-800/80">
                            <button
                              onClick={() => {
                                logout();
                                setIsDropdownOpen(false);
                              }}
                              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-red-400 bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                            >
                              <FaSignOutAlt className="w-3.5 h-3.5" />
                              <span>Sign Out</span>
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-1">
              <Link
                to="/"
                className={getMobileLinkStyles("home")}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={getMobileLinkStyles("about")}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={getMobileLinkStyles("dashboard")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <p className="px-4 py-1 text-xs text-slate-500">
                      Logged in as {user?.user?.email}
                    </p>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-950/30 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center px-4 py-2.5 text-sm font-semibold text-slate-200 bg-slate-800 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;