/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import PriceRule from "../../services/network/priceRule";

export const getAllPriceRules = createAsyncThunk(
  "priceRule/getAll",
  async (
    { page = 1, limit = 10, cinema_id }: { page?: number; limit?: number; cinema_id?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await PriceRule.allPriceRules(page, limit, cinema_id);
      return {
        data: response.data.data.priceRules,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createPriceRule = createAsyncThunk(
  "priceRule/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await PriceRule.createPriceRule(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updatePriceRule = createAsyncThunk(
  "priceRule/update",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await PriceRule.updatePriceRule(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deletePriceRule = createAsyncThunk(
  "priceRule/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await PriceRule.deletePriceRule(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const priceRuleSlice = createSlice({
  name: "priceRule",
  initialState: {
    priceRules: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPriceRules.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPriceRules.fulfilled, (state, action) => {
        state.loading = false;
        state.priceRules = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllPriceRules.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createPriceRule.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPriceRule.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePriceRule.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePriceRule.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default priceRuleSlice.reducer;
