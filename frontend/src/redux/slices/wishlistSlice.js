import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});



// Async thunk to fetch wishlist from backend
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
     const response = await api.get('/api/user/wishlist');

return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch wishlist'
      );
    }
  }
);

// Async thunk to add item to wishlist
export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/user/wishlist', { productId });

return response.data.wishlist;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to wishlist'
      );
    }
  }
);

// Async thunk to remove item from wishlist
export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/user/wishlist/${productId}`);
       return response.data.wishlist;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove from wishlist'
      );
    }
  }
);

// Two helpers to update the wishlist state based on backend response or local changes
const updateWishlistState = (state, wishlist) => {
    state.items = wishlist.products.map(
        item => item.productId._id
    );
    state.totalItems = state.items.length;
};

const updateLocalWishlistState = (state) => {
  state.totalItems = state.items.length;
};

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlistLocal: (state, action) => {
  const productId = action.payload;

  if (!state.items.includes(productId)) {
    state.items.push(productId);
    updateLocalWishlistState(state);
  }
},

    removeFromWishlistLocal: (state, action) => {
  const productId = action.payload;
  state.items = state.items.filter(id => id !== productId);
  updateLocalWishlistState(state);
},

    clearWishlistLocal: state => {
      state.items = [];
      updateLocalWishlistState(state);
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchWishlist.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        updateWishlistState(state, action.payload);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
         updateWishlistState(state, action.payload);
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        updateWishlistState(state, action.payload);
      });
  },
});

export const {
  addToWishlistLocal,
  removeFromWishlistLocal,
  clearWishlistLocal,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;