/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import ProductCategories from "../../services/network/productCat";

export const getAllProductCategories = createAsyncThunk(
  "productCategory/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await ProductCategories.allProductCategories(
        page,
        limit
      );
      return {
        data: response.data.data.productCategories,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createProductCategories = createAsyncThunk(
  "productCategory/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await ProductCategories.createProductCategories(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updateProductCategories = createAsyncThunk(
  "productCategory/update",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await ProductCategories.updateProductCategories(
        id,
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deleteProductCategories = createAsyncThunk(
  "productCategory/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await ProductCategories.deleteProductCategories(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const productCategorySlice = createSlice({
  name: "productCategory",
  initialState: {
    productCats: [],
    productCatLoading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductCategories.pending, (state) => {
        state.productCatLoading = true;
      })
      .addCase(getAllProductCategories.fulfilled, (state, action) => {
        state.productCatLoading = false;
        state.productCats = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllProductCategories.rejected, (state) => {
        state.productCatLoading = false;
      })
      .addCase(createProductCategories.pending, (state) => {
        state.productCatLoading = true;
      })
      .addCase(createProductCategories.fulfilled, (state) => {
        state.productCatLoading = false;
      })
      .addCase(updateProductCategories.fulfilled, (state) => {
        state.productCatLoading = false;
      })
      .addCase(deleteProductCategories.fulfilled, (state) => {
        state.productCatLoading = false;
      });
  },
});

export default productCategorySlice.reducer;
