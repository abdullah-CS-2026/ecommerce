import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingCart, Search, Menu, X, User, LogOut, Heart } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Notification from '../Notification';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useContext(AuthContext);

  // Get cart and wishlist counts from Redux
  const cartCount = useSelector((state) => state.cart.totalItems);
  const wishlistCount = useSelector((state) => state.wishlist.totalItems);

  // Subtle shadow once the page scrolls, so the fixed navbar reads
  // as "lifted" instead of flat against the page content underneath.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on route change so it never stays open
  // after navigating.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const linkClass = (path) =>
    location.pathname === path
      ? 'text-primary font-semibold'
      : 'text-slate-600 hover:text-primary transition-colors';

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <>
      <Notification />
      <div
        className={`fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-200 transition-shadow duration-300 ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        {/* Free Delivery Banner */}
        <div className="bg-primary text-white text-[11px] sm:text-sm text-center py-1.5 sm:py-2 font-medium tracking-wide px-3">
          <span className="hidden sm:inline">Free Delivery on all orders above $50! Shop Now</span>
          <span className="sm:hidden">Free delivery over $50</span>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-[72px]">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight shrink-0">
              Electro<span className="text-primary">Digital</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className={linkClass(link.path)}>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-5 xl:space-x-6">
              <button
                className="text-slate-600 hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/cart"
                className="relative text-slate-600 hover:text-primary transition-colors group"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/profile#wishlist"
                className="relative text-slate-600 hover:text-primary transition-colors group"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Auth Section Desktop */}
              <div className="flex items-center border-l pl-5 xl:pl-6 border-slate-200">
                {user ? (
                  <div className="group relative">
                    <button className="flex items-center text-slate-600 hover:text-primary font-medium transition-colors">
                      <User className="w-5 h-5 mr-1" />
                      <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                    </button>
                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                      <div className="px-4 py-2 border-b border-slate-100 text-sm text-slate-500 truncate">
                        {user.email}
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-bold text-primary"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        My Profile
                      </Link>
                      <Link
                        to="/profile#wishlist"
                        className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Wishlist
                        {wishlistCount > 0 && (
                          <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center text-primary font-semibold hover:text-blue-700 transition-colors">
                    <User className="w-5 h-5 mr-1" /> Login
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile / tablet controls */}
            <div className="lg:hidden flex items-center gap-3 sm:gap-4">
              <Link to="/cart" className="relative text-slate-600" aria-label="Cart">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-600 hover:text-primary focus:outline-none"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-white border-t border-slate-100 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
            isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pt-3 pb-5 space-y-1 shadow-lg">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-3">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
              />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2.5 rounded-md text-base ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAdmin && (
              <Link to="/admin" className="block px-3 py-2.5 rounded-md text-base text-primary font-bold bg-primary/5">
                Admin Panel
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/profile#wishlist"
                  className="flex items-center px-3 py-2.5 rounded-md text-base text-slate-700 hover:bg-slate-50"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="block px-3 py-2.5 rounded-md text-base text-slate-700 hover:bg-slate-50">
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2.5 rounded-md text-base text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-2" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2.5 rounded-md text-base text-primary font-semibold bg-primary/5"
              >
                <User className="w-5 h-5 mr-2" /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;