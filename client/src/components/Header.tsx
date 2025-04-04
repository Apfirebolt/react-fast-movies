import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/auth";
import { FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-white">
      <aside>
        <div className="md:hidden py-3 px-2">
          <button
            className="text-white focus:outline-none"
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
                    <Link to="/" className="hover:text-light">
                      Home
                    </Link>
                  </li>
                  <li className="bg-secondary p-2 rounded-md">
                    <Link to="/about" className="hover:text-light">
                      About
                    </Link>
                  </li>
                  {user ? (
                    <>
                      <li className="hover:text-light">Welcome, {user?.user?.email}</li>
                      <li className="bg-secondary p-2 rounded-md">
                        <Link to="/dashboard" className="hover:text-light">
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
                        <Link to="/login" className="hover:text-light">
                          Login
                        </Link>
                      </li>
                      <li className="bg-secondary p-2 rounded-md">
                        <Link to="/register" className="hover:text-light">
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
      <div className="container hidden md:flex mx-auto justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold">
          <Link to="/">Fast React Movies</Link>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-light transition-all duration-200 hover:text-xl">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-light transition-all duration-200 hover:text-xl">
                About
              </Link>
            </li>
            {user ? (
              <>
                <li className="hover:text-light">Welcome, {user.user.email}</li>
                <li>
                  <Link to="/dashboard" className="hover:text-light transition-all duration-200 hover:text-xl">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="hover:text-light focus:outline-none transition-all duration-200 hover:text-xl"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-light">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-light">
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
