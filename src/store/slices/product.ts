/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Product from "../../services/network/product";

export const getAllProducts = createAsyncThunk(
  "product/getAll",
  async (
    { page = 1, limit = 10, cinema_id }: { page?: number; limit?: number; cinema_id?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await Product.allProducts(page, limit, cinema_id);
      return {
        data: response.data.data.products,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createProduct = createAsyncThunk(
  "productCategory/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Product.createProduct(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Product.updateProduct(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Product.deleteProduct(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const getAvailableProducts = createAsyncThunk(
  "product/getAvailable",
  async ({ page = 1, limit = 10, cinema_id }: { page?: number; limit?: number; cinema_id?: string },
    { rejectWithValue }) => {
    try {
      const response = await Product.availableProducts(page, limit, cinema_id);
      return {
        data: response.data.data.products,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    availableProducts: [],
    productLoading: false,
    error: null,
    productPage: 1,
    productLimit: 10,
    productTotal: 0,
    availableProductPage: 1,
    availableProductLimit: 10,
    availableProductTotal: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.productLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.productLoading = false;
        state.products = action.payload.data || [];
        state.productPage = action.payload.page;
        state.productLimit = action.payload.limit;
        state.productTotal = action.payload.total;
      })
      .addCase(getAllProducts.rejected, (state) => {
        state.productLoading = false;
      })
      .addCase(getAvailableProducts.pending, (state) => {
        state.productLoading = true;
      })
      .addCase(getAvailableProducts.fulfilled, (state, action) => {
        state.productLoading = false;
        state.availableProducts = action.payload.data || [];
        state.availableProductPage = action.payload.page;
        state.availableProductLimit = action.payload.limit;
        state.availableProductTotal = action.payload.total;
      })
      .addCase(getAvailableProducts.rejected, (state) => {
        state.productLoading = false;
      })
      .addCase(createProduct.pending, (state) => {
        state.productLoading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.productLoading = false;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.productLoading = false;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.productLoading = false;
      });
  },
});

export default productSlice.reducer;
