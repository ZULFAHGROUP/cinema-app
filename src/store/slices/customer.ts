/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Customer from "../../services/network/customer";

export const getAllCustomers = createAsyncThunk(
  "customer/getAll",
  async (
    {
      page = 1,
      limit = 10,
      search,
      is_verified,
    }: { page?: number; limit?: number; search?: string; is_verified?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await Customer.getCustomers(page, limit, search, is_verified);
      return {
        data: response.data.data.users,
        page,
        limit,
        total: response.data.data.pagination.total,
        stats: response.data.data.stats,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customers: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
    stats: null as {
      total_customers: number;
      verified_customers: number;
      unverified_customers: number;
      new_this_month: number;
    } | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.stats = action.payload.stats || null;
      })
      .addCase(getAllCustomers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default customerSlice.reducer;
