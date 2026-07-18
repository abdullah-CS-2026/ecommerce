import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadCartFromLocalStorage,
  addToCartLocal,
  removeFromCartLocal,
  updateQuantityLocal,
  clearCartLocal,
  fetchCart,
  clearCartAsync,
  addToCartAsync,
  removeFromCartAsync,
} from "../redux/slices/cartSlice";
import { AuthContext } from './AuthContext';



export const CartContext = createContext();

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // Get cart data from Redux store
  const cartItems = useSelector(state => state.cart.items);
  const totalItems = useSelector(state => state.cart.totalItems);
  const totalPrice = useSelector(state => state.cart.totalPrice);

  // Load cart on mount
 useEffect(() => {
  console.log("User changed:", user);

  if (user) {
    console.log("Fetching cart...");
    dispatch(fetchCart());
  } else {
    console.log("Loading local cart...");
    dispatch(loadCartFromLocalStorage());
  }
}, [user, dispatch]);

  const syncCartToBackend = async (updatedItems) => {
    if (!user) return;
    
    try {
      try {
        await axios.delete(`${baseUrl}/api/cart/clear`);
      } catch (error) {
        console.warn('Failed to clear remote cart:', error.response?.status);
      }

      for (const item of updatedItems) {
        try {
          await axios.post(`${baseUrl}/api/cart/add`, {
            productId: item.product._id,
            quantity: item.quantity
          });
        } catch (error) {
          console.error('Failed to add item to cart:', error.response?.status);
        }
      }
    } catch (error) {
      console.error('Failed to sync cart to backend:', error);
    }
  };

const addToCart = useCallback((product, quantity = 1) => {
  if (user) {
    dispatch(
      addToCartAsync({
        productId: product._id,
        quantity,
      })
    );

    return;
  }

  dispatch(addToCartLocal({ product, quantity }));
}, [user, dispatch]);

const removeFromCart = useCallback((productId) => {
  if (user) {
    dispatch(removeFromCartAsync(productId));
    return;
  }

  dispatch(removeFromCartLocal(productId));
}, [user, dispatch]);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (user) {
      const updatedItems = cartItems.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      syncCartToBackend(updatedItems);
    }

    dispatch(updateQuantityLocal({ productId, quantity: newQuantity }));
  }, [user, cartItems, dispatch, removeFromCart]);

  const clearCart = useCallback(async () => {
    dispatch(clearCartLocal());
    
    if (user) {
      try {
        await dispatch(clearCartAsync());
      } catch (error) {
        console.error('Failed to clear cart from backend:', error);
      }
    }
  }, [user, dispatch]);

  const getTotalPrice = () => totalPrice;
  const getTotalItems = () => totalItems;

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    totalItems,
    totalPrice
  }), [cartItems, totalItems, totalPrice]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
