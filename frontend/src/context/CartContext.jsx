import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // Fetch cart from backend when user logs in, or from localStorage for anonymous users
  useEffect(() => {
    if (user) {
      // User is logged in - fetch their cart from backend
      fetchCartFromBackend();
    } else {
      // User is logged out - clear cart from UI
      setCartItems([]);
      // Load cart from localStorage for anonymous users
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
          setCartItems([]);
        }
      }
    }
  }, [user]);

  // Save cart to localStorage whenever it changes (for anonymous users only)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const fetchCartFromBackend = async () => {
    try {
      setIsLoadingCart(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('/api/cart', config);
      
      // Transform backend cart format to frontend format
      const items = response.data.cart.items.map(item => ({
        id: `${item.productId._id}-${item.productId.name}`,
        product: item.productId,
        quantity: item.quantity
      }));
      setCartItems(items);
    } catch (error) {
      console.error('Failed to fetch cart from backend:', error);
      setCartItems([]);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const syncCartToBackend = async (updatedItems) => {
    if (!user) return; // Only sync for authenticated users
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found. Cannot sync cart to backend.');
        return;
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Clear remote cart first
      try {
        await axios.delete('/api/cart/clear', config);
      } catch (error) {
        console.warn('Failed to clear remote cart:', error.response?.status, error.message);
        // Continue anyway and try to add items
      }

      // Add each item to remote cart
      for (const item of updatedItems) {
        try {
          await axios.post(
            '/api/cart/add',
            {
              productId: item.product._id,
              quantity: item.quantity
            },
            config
          );
        } catch (error) {
          console.error('Failed to add item to cart:', error.response?.status, error.message);
        }
      }
    } catch (error) {
      console.error('Failed to sync cart to backend:', error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if product already exists in cart
      const existingItem = prevItems.find(item => item.product._id === product._id);

      let updatedItems;
      if (existingItem) {
        // Update quantity if product exists
        updatedItems = prevItems.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [
          ...prevItems,
          {
            id: `${product._id}-${Date.now()}`,
            product,
            quantity
          }
        ];
      }

      // Sync to backend if user is logged in
      if (user) {
        syncCartToBackend(updatedItems);
      }

      return updatedItems;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.product._id !== productId);
      
      // Sync to backend if user is logged in
      if (user) {
        syncCartToBackend(updatedItems);
      }

      return updatedItems;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );

      // Sync to backend if user is logged in
      if (user) {
        syncCartToBackend(updatedItems);
      }

      return updatedItems;
    });
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    
    // Clear from backend if user is logged in
    if (user) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete('/api/cart/clear', config);
      } catch (error) {
        console.error('Failed to clear cart from backend:', error);
      }
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
