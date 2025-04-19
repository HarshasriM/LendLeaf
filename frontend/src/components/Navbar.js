import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials, logoutUser } from '../features/auth/authSlice.js';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const handleLogout = async () => {
      const resultAction = await dispatch(logoutUser()); // 👈 Await the thunk dispatch
      if (logoutUser.fulfilled.match(resultAction)) {
        dispatch(clearCredentials()); // No need to pass resultAction
        navigate("/login");
      }
    };

  return (
    <nav className="bg-gradient-to-r from-secondary to-primary text-white font-bold fixed w-full z-20 shadow-md px-4">
      <div className="flex justify-between items-center py-4 md:px-6">
        {/* Logo & Menu Icon */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link  to="/" className="text-2xl">LendLeaf</Link>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}><MenuIcon /></button>
          </div>
        </div>

        {/* Nav Links */}
        <ul
          className={`md:flex gap-8 md:items-center absolute md:static bg-secondary md:bg-transparent left-0 w-full md:w-auto md:space-y-0 space-y-4 md:py-0 py-4 px-4 md:px-0 top-16 transition-all duration-300 ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          <li>
            <Link to="/" className="hover:text-xl transition-text duration-300">Home</Link>
          </li>
          <li>
            <Link to="/books" className="hover:text-xl transition-text duration-300">Books</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-xl transition-text duration-300">About Us</Link>
          </li>

          {!isAuthenticated ? (
            <li>
              <Link to="/login" className="hover:text-xl transition-text duration-300">Login</Link>
            </li>
          ) : (
             <>
                 <li>
                    <Link to="/" className="hover:text-xl transition-text duration-300"> Add a book</Link>
                </li>
                <li className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                    >
                        <AccountCircleIcon style={{fontSize:"40px"}}/> {user?.name || ''}
                    </button>
                    {profileOpen && (
                        <ul className="absolute bg-white text-black rounded shadow-md mt-2 w-40 right-0 z-10">
                        <li>
                            <Link
                            to="/dashboard"
                            className="block px-4 py-2 hover:bg-gray-200"
                            onClick={() => setProfileOpen(false)}
                            >
                            My Dashboard
                            </Link>
                        </li>
                        <li>
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            >
                            Logout
                            </button>
                        </li>
                        </ul>
                    )}
                </li>
             </>
           
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
