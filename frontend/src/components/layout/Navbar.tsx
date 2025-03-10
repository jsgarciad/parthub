import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

/**
 * Navbar component
 */
const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const categories = [
    { name: 'Engine Parts', path: '/category/engine' },
    { name: 'Brake Systems', path: '/category/brakes' },
    { name: 'Drivetrain', path: '/category/drivetrain' },
    { name: 'Exhaust Systems', path: '/category/exhaust' },
    { name: 'Lighting', path: '/category/lighting' },
    { name: 'Detailing Products', path: '/category/detailing' },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold">
                PartHub
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Link to="/" className="px-3 py-2 hover:bg-blue-700 rounded-md">
                Home
              </Link>
              <Link to="/parts" className="px-3 py-2 hover:bg-blue-700 rounded-md">
                Parts
              </Link>
              {isAuthenticated && user?.store && (
                <Link to="/dashboard" className="px-3 py-2 hover:bg-blue-700 rounded-md">
                  Dashboard
                </Link>
              )}
              {isAuthenticated && user?.isAdmin && (
                <Link to="/admin" className="px-3 py-2 hover:bg-blue-700 rounded-md">
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Search, Profile, and Mobile Menu */}
          <div className="flex items-center">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block mr-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search parts..."
                  className="w-64 px-4 py-1 text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-1 mr-2 text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Cart */}
            <Link to="/cart" className="mr-4 relative">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                </div>
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user?.username}</p>
                      {user?.store && <p className="text-xs">{user.store.name}</p>}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    {user?.store && (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1 border border-white rounded-md hover:bg-white hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 bg-white text-blue-600 rounded-md hover:bg-blue-50"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md hover:bg-blue-700"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/parts"
            className="block px-3 py-2 rounded-md hover:bg-blue-700"
            onClick={toggleMenu}
          >
            Parts
          </Link>
          <Link
            to="/cart"
            className="block px-3 py-2 rounded-md hover:bg-blue-700"
            onClick={toggleMenu}
          >
            Cart {cart.totalItems > 0 && `(${cart.totalItems})`}
          </Link>
          {isAuthenticated && user?.store && (
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md hover:bg-blue-700"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated && user?.isAdmin && (
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-md hover:bg-blue-700"
              onClick={toggleMenu}
            >
              Admin
            </Link>
          )}
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md hover:bg-blue-700"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md hover:bg-blue-700"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
        {/* Mobile Search */}
        <div className="px-2 pb-3">
          <form onSubmit={handleSearch} className="mt-1">
            <input
              type="text"
              placeholder="Search parts..."
              className="w-full px-4 py-2 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
