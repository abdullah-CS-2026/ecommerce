import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch wishlist from backend
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/user/wishlist');
      const items = response.data.products?.map(item => item.productId._id) || [];
      return items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

// Async thunk to add item to wishlist
export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.post('/api/user/wishlist', { productId });
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

// Async thunk to remove item from wishlist
export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/user/wishlist/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlistLocal: (state, action) => {
      const productId = action.payload;
      if (!state.items.includes(productId)) {
        state.items.push(productId);
        state.totalItems = state.items.length;
      }
    },

    removeFromWishlistLocal: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(id => id !== productId);
      state.totalItems = state.items.length;
    },

    clearWishlistLocal: (state) => {
      state.items = [];
      state.totalItems = 0;
    }
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.totalItems = state.items.length;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Add to wishlist
    builder
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        if (!state.items.includes(action.payload)) {
          state.items.push(action.payload);
          state.totalItems = state.items.length;
        }
      });

    // Remove from wishlist
    builder
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(id => id !== action.payload);
        state.totalItems = state.items.length;
      });
  }
});

export const {
  addToWishlistLocal,
  removeFromWishlistLocal,
  clearWishlistLocal
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
