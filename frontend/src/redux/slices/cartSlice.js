import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch cart from backend
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/cart');
      const items = response.data.cart.items.map(item => ({
        id: `${item.productId._id}-${item.productId.name}`,
        product: item.productId,
        quantity: item.quantity
      }));
      return items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// Async thunk to add item to cart
export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      await axios.post('/api/cart/add', { productId, quantity });
      return { productId, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

// Async thunk to remove item from cart
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/cart/remove/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

// Async thunk to clear cart
export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete('/api/cart/clear');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local-only actions for anonymous users
    addToCartLocal: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: `${product._id}-${Date.now()}`,
          product,
          quantity
        });
      }

      // Update total items count
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);

      // Save to localStorage for anonymous users
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    removeFromCartLocal: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product._id !== productId);

      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);

      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    updateQuantityLocal: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product._id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.product._id !== productId);
        } else {
          item.quantity = quantity;
        }
      }

      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);

      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    clearCartLocal: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },

    loadCartFromLocalStorage: (state) => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          state.items = JSON.parse(savedCart);
          state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
          state.totalPrice = state.items.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
        }
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Clear cart
    builder
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      });
  }
});

export const {
  addToCartLocal,
  removeFromCartLocal,
  updateQuantityLocal,
  clearCartLocal,
  loadCartFromLocalStorage
} = cartSlice.actions;

export default cartSlice.reducer;
