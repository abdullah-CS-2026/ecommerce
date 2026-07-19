import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
console.log("ENV =", import.meta.env.VITE_BACKEND_URL);
console.log("BASE URL =", api.defaults.baseURL);

// Async thunk to fetch cart from backend
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
        console.log("Calling GET /api/cart");

      const response = await api.get("/api/cart");

      console.log("Cart API Response:", response.data);

      return response.data.cart;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);

// Async thunk to add item to cart
export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/cart/add", {
        productId,
        quantity,
      });

      console.log("Updated Cart:", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

// Async thunk to remove item from cart
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/cart/remove/${productId}`);

      console.log("Updated Cart:", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from cart"
      );
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/cart/update", {
        productId,
        quantity,
      });

      console.log("Updated Cart:", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

// Async thunk to clear cart
export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/api/cart/clear');
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear cart'
      );
    }
  }
);


// Why are you using cart.items at "cart.items.map((item)" instead of state.items ?

// A strong answer would be:
// "Because cart.items contains the latest data returned by the backend after the operation. The backend is the single source of truth, so we update the Redux state using the fresh backend response instead of relying on the existing Redux state."

const updateCartState = (state, cart) => {
  state.items = cart.items.map((item) => ({
    id: `${item.productId._id}-${item.productId.name}`,
    product: item.productId,
    quantity: item.quantity,
  }));

  state.totalItems = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  state.totalPrice = state.items.reduce(
    (sum, item) =>
      sum + item.product.discountPrice * item.quantity,
    0
  );
};

const updateLocalCartState = (state) => {
  state.totalItems = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  state.totalPrice = state.items.reduce(
    (sum, item) =>
      sum + item.product.discountPrice * item.quantity,
    0
  );

  localStorage.setItem("cart", JSON.stringify(state.items));
};


const initialState = {
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    addToCartLocal: (state, action) => {
      const { product, quantity } = action.payload;

      const existingItem = state.items.find(
        item => item.product._id === product._id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: `${product._id}-${Date.now()}`,
          product,
          quantity,
        });
      }

      updateLocalCartState(state);
    },

    removeFromCartLocal: (state, action) => {
      const productId = action.payload;

      state.items = state.items.filter(
        item => item.product._id !== productId
      );

     updateLocalCartState(state);
    },

    updateQuantityLocal: (state, action) => {
      const { productId, quantity } = action.payload;

      const item = state.items.find(
        item => item.product._id === productId
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            item => item.product._id !== productId
          );
        } else {
          item.quantity = quantity;
        }
      }

      updateLocalCartState(state);
    },

    clearCartLocal: state => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;

      localStorage.removeItem('cart');
    },

    loadCartFromLocalStorage: state => {
      const savedCart = localStorage.getItem('cart');

      if (savedCart) {
        try {
          state.items = JSON.parse(savedCart);

          state.totalItems = state.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          state.totalPrice = state.items.reduce(
            (sum, item) =>
              sum + item.product.discountPrice * item.quantity,
            0
          );
        } catch (error) {
          console.error('Failed to load cart:', error);
        }
      }
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, (state) => {
    state.isLoading = true;
    state.error = null;
})

.addCase(fetchCart.fulfilled, (state, action) => {
    state.isLoading = false;
    updateCartState(state, action.payload);
})
      

      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addToCartAsync.fulfilled, (state, action) => {
    updateCartState(state, action.payload);
})

.addCase(updateQuantityAsync.fulfilled, (state, action) => {
    updateCartState(state, action.payload);
})

.addCase(removeFromCartAsync.fulfilled, (state, action) => {
    updateCartState(state, action.payload);
})

.addCase(clearCartAsync.fulfilled, state => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      });
  
  },
});

export const {
  addToCartLocal,
  removeFromCartLocal,
  updateQuantityLocal,
  clearCartLocal,
  loadCartFromLocalStorage,
} = cartSlice.actions;

export default cartSlice.reducer;