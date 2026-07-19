import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 sm:pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 text-center sm:text-left">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white text-xl font-bold mb-4 tracking-tight">
              Electro<span className="text-primary">Digital</span>
            </h3>
            <p className="text-sm leading-relaxed mb-6 max-w-xs mx-auto sm:mx-0">
              Your one-stop destination for the latest and greatest in electronics. We provide
              top-quality products with unparalleled customer service.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-slate-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-slate-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-slate-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start justify-center sm:justify-start">
                <MapPin className="w-5 h-5 text-primary mr-3 shrink-0" />
                <span className="text-left">Quainchi Metro Station, Lahore</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <Phone className="w-5 h-5 text-primary mr-3 shrink-0" />
                <span>+92 341 3348205</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <Mail className="w-5 h-5 text-primary mr-3 shrink-0" />
                <span className="break-all">support@electromart.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Newsletter</h4>
            <p className="text-sm mb-4 max-w-xs mx-auto sm:mx-0">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex flex-col space-y-2 max-w-xs mx-auto sm:mx-0">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                className="bg-slate-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-slate-700 placeholder-slate-500"
              />
              <button
                type="button"
                className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-medium shadow-sm hover:shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} ElectroDigital. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;