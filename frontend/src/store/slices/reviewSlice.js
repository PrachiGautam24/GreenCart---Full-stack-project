import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/reviewService';
import { getErrorMessage } from '../../utils/errorHandler';

// Async thunks
export const submitReview = createAsyncThunk(
  'review/submitReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const data = await reviewService.submitReview(reviewData);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to submit review');
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  'review/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await reviewService.fetchProductReviews(productId);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to fetch product reviews');
    }
  }
);

export const fetchSellerReviews = createAsyncThunk(
  'review/fetchSellerReviews',
  async (sellerId, { rejectWithValue }) => {
    try {
      const data = await reviewService.fetchSellerReviews(sellerId);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to fetch seller reviews');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
    submitSuccess: false
  },
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    clearSubmitSuccess: (state) => {
      state.submitSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload.review);
        state.submitSuccess = true;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.submitSuccess = false;
      })
      // Fetch product reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch seller reviews
      .addCase(fetchSellerReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(fetchSellerReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          review => review._id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearReviewError, clearSubmitSuccess } = reviewSlice.actions;
export default reviewSlice.reducer;
