import React from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/auth";


const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold">
          <Link to="/">Fast React Movies</Link>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-400">
                About
              </Link>
            </li>
            {user ? (
              <>
                <li className="hover:text-gray-400">Welcome {user.user.email}</li>
                <li>
                  <Link to="/dashboard" className="hover:text-gray-400">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="hover:text-gray-400 focus:outline-none"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-gray-400">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-gray-400">
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
