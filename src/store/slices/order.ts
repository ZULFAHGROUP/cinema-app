/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Order from "../../services/network/order";

export const getAllOrders = createAsyncThunk(
  "order/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await Order.allOrders(page, limit);
      return {
        data: response.data.data.orders,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getOrderById = createAsyncThunk(
  "order/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await Order.getOrder(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getOrderStats = createAsyncThunk(
  "order/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Order.orderStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (
    { userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await Order.userOrders(userId, page, limit);
      return {
        data: response.data.data.orders,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getCinemaOrders = createAsyncThunk(
  "order/getCinemaOrders",
  async (
    { cinemaId, page = 1, limit = 10 }: { cinemaId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await Order.cinemaOrders(cinemaId, page, limit);
      return {
        data: response.data.data.orders,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
  orders: [],
  selectedOrder: null,
  orderStats: null as any,
  orderLoading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Orders
      .addCase(getAllOrders.pending, (state) => {
        state.orderLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orders = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllOrders.rejected, (state) => {
        state.orderLoading = false;
      })
      // Get Order By ID
      .addCase(getOrderById.pending, (state) => {
        state.orderLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.selectedOrder = action.payload.data;
      })
      .addCase(getOrderById.rejected, (state) => {
        state.orderLoading = false;
      })
      // Get Order Stats
      .addCase(getOrderStats.pending, (state) => {
        state.orderLoading = true;
      })
      .addCase(getOrderStats.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orderStats = action.payload.data;
      })
      .addCase(getOrderStats.rejected, (state) => {
        state.orderLoading = false;
      })
      // Get User Orders
      .addCase(getUserOrders.pending, (state) => {
        state.orderLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orders = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getUserOrders.rejected, (state) => {
        state.orderLoading = false;
      })
      // Get Cinema Orders
      .addCase(getCinemaOrders.pending, (state) => {
        state.orderLoading = true;
      })
      .addCase(getCinemaOrders.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orders = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getCinemaOrders.rejected, (state) => {
        state.orderLoading = false;
      });
  },
});

export default orderSlice.reducer;
