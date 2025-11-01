import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../stores/auth";
import { FaBars, FaChevronDown } from "react-icons/fa";
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
      "hover:text-dark transition-all duration-200 hover:text-xl";
    const activeStyles = selectedTab === tabName ? "font-bold underline" : "";
    return `${baseStyles} ${activeStyles}`;
  };

  const getMobileLinkStyles = (tabName: string) => {
    const baseStyles = "hover:text-light";
    const activeStyles = selectedTab === tabName ? "font-bold underline" : "";
    return `${baseStyles} ${activeStyles}`;
  };

  return (
    <header className="bg-white text-primary">
      <aside>
        <div className="md:hidden py-3 px-2">
          <button
            className="focus:outline-none"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <FaBars size={24} />
          </button>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                id="mobile-menu"
                className="bg-gray-800 text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ul className="flex flex-col space-y-4 p-4">
                  <li className="bg-secondary p-2 rounded-md">
                    <Link to="/" className={getMobileLinkStyles("home")}>
                      Home
                    </Link>
                  </li>
                  <li className="bg-secondary p-2 rounded-md">
                    <Link to="/about" className={getMobileLinkStyles("about")}>
                      About
                    </Link>
                  </li>
                  {user ? (
                    <>
                      <li className="hover:text-light">
                        Welcome, {user?.user?.email}
                      </li>
                      <li className="bg-secondary p-2 rounded-md">
                        <Link
                          to="/dashboard"
                          className={getMobileLinkStyles("dashboard")}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li className="bg-secondary p-2 rounded-md">
                        <button
                          onClick={logout}
                          className="hover:text-light focus:outline-none"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="bg-secondary p-2 rounded-md">
                        <Link
                          to="/login"
                          className={getMobileLinkStyles("login")}
                        >
                          Login
                        </Link>
                      </li>
                      <li className="bg-secondary p-2 rounded-md">
                        <Link
                          to="/register"
                          className={getMobileLinkStyles("register")}
                        >
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
      <div className="container hidden md:flex mx-auto justify-between items-center px-6">
        <img src={Logo} alt="Company Logo" className="logo-style" />
        <h1 className="text-2xl font-bold">
          <Link to="/">Monstella</Link>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className={getLinkStyles("home")}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={getLinkStyles("about")}>
                About
              </Link>
            </li>
            {user ? (
              <>
                <li className="relative" ref={dropdownRef}>
                    <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="hover:text-dark flex items-center gap-1 focus:outline-none transition-all duration-200"
                    >
                    Welcome, {user?.user?.email}
                    <FaChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-2">Account</h3>
                              <ul className="space-y-2">
                                <li>
                                  <Link to="/profile" className="text-gray-600 hover:text-primary block">
                                    Profile
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/settings" className="text-gray-600 hover:text-primary block">
                                    Settings
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/billing" className="text-gray-600 hover:text-primary block">
                                    Billing
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-2">Content</h3>
                              <ul className="space-y-2">
                                <li>
                                  <Link to="/favorites" className="text-gray-600 hover:text-primary block">
                                    Favorites
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/watchlist" className="text-gray-600 hover:text-primary block">
                                    Watchlist
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/history" className="text-gray-600 hover:text-primary block">
                                    History
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => {
                                logout();
                                setIsDropdownOpen(false);
                              }}
                              className="w-full px-2 py-1 shadow-lg rounded-xl text-center text-white bg-primary border border-transparent hover:border-red-800 focus:outline-none"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
                <li>
                  <Link to="/dashboard" className={getLinkStyles("dashboard")}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="hover:text-dark focus:outline-none transition-all duration-200 hover:text-xl"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className={getLinkStyles("login")}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={getLinkStyles("register")}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
