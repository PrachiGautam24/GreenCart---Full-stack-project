import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';
import { getErrorMessage } from '../../utils/errorHandler';

// Initial state
const initialState = {
  users: [],
  loading: false,
  error: null
};

// Async thunks

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminService.getAllUsers();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to fetch users');
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const data = await adminService.updateUserRole(userId, role);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to update user role');
    }
  }
);

// Toggle user status
export const toggleUserStatus = createAsyncThunk(
  'admin/toggleUserStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await adminService.toggleUserStatus(userId);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to toggle user status');
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await adminService.deleteProduct(productId);
      return { productId, ...data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to delete product');
    }
  }
);

// Delete review
export const deleteReview = createAsyncThunk(
  'admin/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const data = await adminService.deleteReview(reviewId);
      return { reviewId, ...data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to delete review');
    }
  }
);

// Admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.user || action.payload;
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle user status
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.user || action.payload;
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
