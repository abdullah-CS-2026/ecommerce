import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Implemented Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/checkout/Checkout';
import Profile from './pages/Profile';

// Additional Pages
import { AboutUs, ContactUs, Categories, PrivacyPolicy, Terms } from './pages/AdditionalPages';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { WishlistProvider } from './context/WishlistContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';

// Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CheckoutProvider>
            <Router>
              <Routes>
                {/* Admin Routes - No Navbar/Footer layout */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />}>
                    <Route index element={<div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"><h2 className="text-xl font-bold">Welcome, Admin</h2><p className="text-slate-500 mt-2">Manage your inventory and store from here.</p></div>} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/new" element={<AdminProductForm />} />
                    <Route path="products/edit/:id" element={<AdminProductForm />} />
                  </Route>
                </Route>

                {/* User Routes - With Navbar/Footer layout */}
                <Route path="*" element={
                  <div className="flex flex-col min-h-screen bg-slate-50">
                    <Navbar />
                    <main className="flex-grow pt-24 pb-10">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route element={<ProtectedRoute />}>
                          <Route path="/profile" element={<Profile />} />
                        </Route>
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/contact" element={<ContactUs />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<Terms />} />

                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                } />
              </Routes>
            </Router>
          </CheckoutProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
