import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from "react-redux";

import { clearCartLocal } from "../redux/slices/cartSlice";

// later we'll also import wishlist clear action

// Configure axios to send credentials (cookies) with all requests
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

const baseUrl = import.meta.env.VITE_BACKEND_URL;


export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to fetch profile — if user is authenticated (has cookie), backend will return user data
        const response = await axios.get(`${baseUrl}/api/auth/profile`);
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
      const response = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
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
      const response = await axios.post(`${baseUrl}/api/auth/register`, { name, email, password });

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
      const response = await axios.post(`${baseUrl}/api/auth/verify-email`, { email, otp });
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
      const response = await axios.post(`${baseUrl}/api/auth/resend-otp`, { email });
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
      await axios.post(`${baseUrl}/api/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {

      dispatch(clearCartLocal());

      setUser(null);

      localStorage.removeItem("cart");
    }
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/auth/profile`);
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
