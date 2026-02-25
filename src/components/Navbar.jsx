import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { ShoppingCart, User, LogOut, Package, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-900 border-b-4 border-primary-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Brutalist Style */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-primary-500 border-2 border-black flex items-center justify-center transform group-hover:translate-x-1 group-hover:translate-y-1 transition-transform">
              <ShoppingCart className="text-white" size={28} strokeWidth={3} />
            </div>
            <div>
              <span className="text-2xl font-display font-black text-white uppercase tracking-tight">
                FreshMart
              </span>
              <div className="h-1 bg-primary-500 w-0 group-hover:w-full transition-all duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/products" 
              className="text-white font-bold uppercase text-sm tracking-wider hover:text-primary-500 transition-colors border-b-2 border-transparent hover:border-primary-500 pb-1"
            >
              Products
            </Link>

            {isAuthenticated && (
              <>
                {/* Cart Button with Badge */}
                <Link to="/cart" className="relative group">
                  <div className="bg-dark-800 border-2 border-white p-3 hover:bg-primary-500 hover:border-primary-500 transition-all transform hover:translate-x-1 hover:translate-y-1">
                    <ShoppingCart size={20} className="text-white" strokeWidth={2.5} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-black rounded-none w-6 h-6 flex items-center justify-center border-2 border-black">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 font-bold uppercase text-sm tracking-wider border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    <User size={18} strokeWidth={2.5} />
                    <span>{user?.name}</span>
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border-4 border-black shadow-brutal">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-6 py-4 hover:bg-primary-50 border-b-2 border-dark-200 font-semibold"
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-6 py-4 hover:bg-primary-50 border-b-2 border-dark-200 font-semibold"
                      >
                        <Package size={18} />
                        <span>Orders</span>
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-6 py-4 hover:bg-primary-50 border-b-2 border-dark-200 font-semibold text-primary-600"
                        >
                          <span>⚡</span>
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-50 font-semibold text-red-600"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <button className="px-6 py-3 border-2 border-white text-white font-bold uppercase text-sm tracking-wider hover:bg-white hover:text-dark-900 transition-all">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-6 py-3 bg-primary-500 text-white font-bold uppercase text-sm tracking-wider border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 bg-primary-500 text-white border-2 border-black"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t-2 border-dark-700">
            <Link
              to="/products"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-white font-bold hover:bg-dark-800"
            >
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/cart"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-white font-bold hover:bg-dark-800"
                >
                  Cart ({cartCount})
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-white font-bold hover:bg-dark-800"
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-white font-bold hover:bg-dark-800"
                >
                  Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-3 text-primary-500 font-bold hover:bg-dark-800"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-500 font-bold hover:bg-dark-800"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;