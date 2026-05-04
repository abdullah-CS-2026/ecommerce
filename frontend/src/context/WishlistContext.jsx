import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';


export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // Fetch wishlist from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlistFromBackend();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const fetchWishlistFromBackend = async () => {
    try {
      setIsLoadingWishlist(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('/api/user/wishlist', config);
      
      // Transform backend wishlist format to frontend format
      const items = response.data.products?.map(item => item.productId._id) || [];
      setWishlistItems(items);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setWishlistItems([]);
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('Please login to add items to wishlist', 'error');
        return false;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('/api/user/wishlist', { productId }, config);
      
      // Add to local state
      setWishlistItems([...wishlistItems, productId]);
      showNotification('Product added to wishlist', 'success');
      return true;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      if (error.response?.status === 400) {
        showNotification('Product already in wishlist', 'info');
      } else {
        showNotification('Failed to add to wishlist', 'error');
      }
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('Please login to manage wishlist', 'error');
        return false;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/user/wishlist/${productId}`, config);
      
      // Remove from local state
      setWishlistItems(wishlistItems.filter(id => id !== productId));
      showNotification('Product removed from wishlist', 'success');
      return true;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      showNotification('Failed to remove from wishlist', 'error');
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  const value = {
    wishlistItems,
    isLoadingWishlist,
    notification,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlistFromBackend,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
