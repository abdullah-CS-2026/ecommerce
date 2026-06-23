import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios to send credentials (cookies) with all requests
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to fetch profile — if user is authenticated (has cookie), backend will return user data
        const response = await axios.get('/api/auth/profile');
        setUser(response.data);
      } catch (error) {
        // No valid cookie or token, user is not authenticated
        console.log('User not authenticated on app load');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const userData = response.data;
      
      // Token is in HTTP-only cookie, automatically sent by browser
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      
      // Do not log the user in immediately. They must verify via OTP first.
      return { success: true, email: response.data.email };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const response = await axios.post('/api/auth/verify-email', { email, otp });
      const userData = response.data;
      
      // Token is in HTTP-only cookie, automatically sent by browser
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Verification failed' 
      };
    }
  };

  const resendOtp = async (email) => {
    try {
      const response = await axios.post('/api/auth/resend-otp', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Resend failed' 
      };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear the cookie
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear frontend state regardless
      setUser(null);
      // Clear other stored data if needed
      localStorage.removeItem('cart');
    }
  };

  const getProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, verifyEmail, resendOtp, logout, getProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
