import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';
import { getErrorMessage } from '../../utils/errorHandler';

const initialState = {
  products: [],
  currentProduct: null,
  filters: {
    search: '',
    tags: [],
    city: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(filters);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(productId);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(productId, productData);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.deleteProduct(productId);
      return { productId, ...response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error) || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setTagsFilter: (state, action) => {
      state.filters.tags = action.payload;
    },
    setCityFilter: (state, action) => {
      state.filters.city = action.payload;
    },
    toggleTag: (state, action) => {
      const tag = action.payload;
      const index = state.filters.tags.indexOf(tag);
      if (index > -1) {
        state.filters.tags.splice(index, 1);
      } else {
        state.filters.tags.push(tag);
      }
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        tags: [],
        city: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || action.payload;
        
        // Handle pagination if provided
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.product || action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        const newProduct = action.payload.product || action.payload;
        state.products.unshift(newProduct);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload.product || action.payload;
        const index = state.products.findIndex(p => p._id === updatedProduct._id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        if (state.currentProduct && state.currentProduct._id === updatedProduct._id) {
          state.currentProduct = updatedProduct;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload.productId);
        if (state.currentProduct && state.currentProduct._id === action.payload.productId) {
          state.currentProduct = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchFilter,
  setTagsFilter,
  setCityFilter,
  toggleTag,
  clearFilters,
  clearError,
  clearCurrentProduct,
} = productSlice.actions;

export default productSlice.reducer;
