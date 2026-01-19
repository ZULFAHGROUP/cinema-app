/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Customer from "../../services/network/customer";

export const getAllCustomers = createAsyncThunk(
  "customer/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await Customer.getCustomers(page, limit);
      return {
        data: response.data.data.users,
        page,
        limit,
        total: response.data.data.pagination.total,
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
      })
      .addCase(getAllCustomers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default customerSlice.reducer;
