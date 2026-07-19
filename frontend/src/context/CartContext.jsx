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
   addToCartAsync,
  updateQuantityAsync,
   removeFromCartAsync,
  clearCartAsync,
 
  
} from "../redux/slices/cartSlice";
import { AuthContext } from './AuthContext';



export const CartContext = createContext();

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
  dispatch(
    updateQuantityAsync({
      productId,
      quantity: newQuantity,
    })
  );

  return;
}

dispatch(
  updateQuantityLocal({
    productId,
    quantity: newQuantity,
  })
);
  }, [user, cartItems, dispatch, removeFromCart]);

const clearCart = useCallback(async () => {
  if (user) {
    await dispatch(clearCartAsync());
    return;
  }

  dispatch(clearCartLocal());
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
