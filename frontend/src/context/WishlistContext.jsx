import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWishlist,
  addToWishlistAsync,
  removeFromWishlistAsync,
  addToWishlistLocal,
  removeFromWishlistLocal
} from '../redux/slices/wishlistSlice';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Get wishlist data from Redux store
  const wishlistItems = useSelector(state => state.wishlist.items);
  const totalItems = useSelector(state => state.wishlist.totalItems);

  // Load wishlist on mount or when user changes
  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    } else {
      // Clear wishlist when user logs out
      // (handled by Redux or you can add a clear action)
    }
  }, [user, dispatch]);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  }, []);

  const addToWishlist = useCallback(async (productId) => {
    try {
      if (!user) {
        showNotification('Please login to add items to wishlist', 'error');
        return false;
      }

      // Dispatch async action to add to backend
      const result = await dispatch(addToWishlistAsync(productId));
      
      if (result.type === addToWishlistAsync.fulfilled.type) {
        showNotification('Product added to wishlist', 'success');
        return true;
      } else {
        showNotification('Failed to add to wishlist', 'error');
        return false;
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      if (error.response?.status === 400) {
        showNotification('Product already in wishlist', 'info');
      } else {
        showNotification('Failed to add to wishlist', 'error');
      }
      return false;
    }
  }, [user, dispatch, showNotification]);

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      if (!user) {
        showNotification('Please login to manage wishlist', 'error');
        return false;
      }

      // Dispatch async action to remove from backend
      const result = await dispatch(removeFromWishlistAsync(productId));
      
      if (result.type === removeFromWishlistAsync.fulfilled.type) {
        showNotification('Product removed from wishlist', 'success');
        return true;
      } else {
        showNotification('Failed to remove from wishlist', 'error');
        return false;
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      showNotification('Failed to remove from wishlist', 'error');
      return false;
    }
  }, [user, dispatch, showNotification]);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.includes(productId);
  }, [wishlistItems]);

  const fetchWishlistFromBackend = useCallback(async () => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [user, dispatch]);

  const value = useMemo(() => ({
    wishlistItems,
    totalItems,
    notification,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlistFromBackend,
  }), [wishlistItems, totalItems, notification, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlistFromBackend]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
