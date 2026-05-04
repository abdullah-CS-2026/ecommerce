import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, LogOut, Heart } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import Notification from '../Notification';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useContext(AuthContext);
  const { getTotalItems } = useContext(CartContext);
  const cartCount = getTotalItems();
const { wishlistItems } = useContext(WishlistContext);
const wishlistCount = wishlistItems.length;
 
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const bgColor = (path) => location.pathname === path ? 'text-primary font-semibold' : 'text-slate-600 hover:text-primary transition-colors';

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <>
      <Notification />
      <div className="fixed top-0 w-full z-50 bg-white border-b border-slate-200">
      {/* Free Delivery Banner */}
      <div className="bg-primary text-white text-sm text-center py-2 font-medium tracking-wide shadow-sm">
        Free Delivery on all orders above $50! Shop Now
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tight">
            Electro<span className="text-primary">Mart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={bgColor(link.path)}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6 relative">
            <button className="text-slate-600 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="relative text-slate-600 hover:text-primary transition-colors group">
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>
              )}
            </Link>
            <Link to="/profile#wishlist" className="relative text-slate-600 hover:text-primary transition-colors group">
  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
  {wishlistCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{wishlistCount}</span>
  )}
</Link>


            {/* User Auth Section Desktop */}
            <div className="flex items-center border-l pl-6 border-slate-200">
              {user ? (
                <div className="group relative">
                  <button className="flex items-center text-slate-600 hover:text-primary font-medium transition-colors">
                    <User className="w-5 h-5 mr-1" />
                    <span>{user.name.split(' ')[0]}</span>
                  </button>
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                    <div className="px-4 py-2 border-b border-slate-100 text-sm text-slate-500 truncate">{user.email}</div>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-bold text-primary">Admin Panel</Link>
                    )}
                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">My Profile</Link>
                    <Link to="/profile#wishlist" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center">
  <Heart className="w-4 h-4 mr-2" /> 
  Wishlist {wishlistCount > 0 && <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{wishlistCount}</span>}
</Link>

                    
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center">
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="mr-4 relative text-slate-600">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-primary focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base ${location.pathname === link.path ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-md text-base text-primary font-bold bg-primary/5"
              onClick={() => setIsOpen(false)}
            >
              Admin Panel
            </Link>
          )}
          {user && (
  <Link
    to="/wishlist"
    className={`block px-3 py-2 rounded-md text-base flex items-center ${location.pathname === '/wishlist' ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
    onClick={() => setIsOpen(false)}
  >
    <Heart className="w-5 h-5 mr-2" />
    Wishlist
    {wishlistCount > 0 && (
      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{wishlistCount}</span>
    )}
  </Link>
)}
          <div className="pt-4 border-t border-slate-200 mt-4 flex items-center px-3 text-slate-600">
            <Search className="w-5 h-5 mr-3" /> Search
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Navbar;
