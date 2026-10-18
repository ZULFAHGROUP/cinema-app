/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Inventory from "../../services/network/inventory";

export const getAllInventories = createAsyncThunk(
  "inventory/getAll",
  async (
    { page = 1, limit = 10, cinema_id }: { page?: number; limit?: number; cinema_id?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await Inventory.allInventories(page, limit, cinema_id);
      return {
        data: response.data.data.inventories,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteInventory = createAsyncThunk(
  "inventory/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Inventory.deleteInventory(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        response: error.response?.data,
      }) as any;
    }
  }
);

export const getInventoryHistory = createAsyncThunk(
  "inventory/history",
  async (    { inventoryId, cinemaId, }: { inventoryId: any; cinemaId: any; }
, { rejectWithValue }) => {
    try {
      const response = await Inventory.getInventoryHistory(inventoryId, cinemaId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const stockIn = createAsyncThunk(
  "inventory/stockIn",
  async (
    { id, data, idempotencyKey }: { id: string; data: any; idempotencyKey: string },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Inventory.stockIn(id, data, idempotencyKey);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        response: error.response?.data,
      }) as any;
    }
  }
);

export const recordSpoilage = createAsyncThunk(
  "inventory/spoilage",
  async (
    { id, data, idempotencyKey }: { id: string; data: any; idempotencyKey: string },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Inventory.recordSpoilage(id, data, idempotencyKey);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        response: error.response?.data,
      }) as any;
    }
  }
);

export const correctInventory = createAsyncThunk(
  "inventory/correction",
  async (
    { id, data, idempotencyKey }: { id: string; data: any; idempotencyKey: string },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Inventory.correctInventory(id, data, idempotencyKey);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        response: error.response?.data,
      }) as any;
    }
  }
);

export const transferOut = createAsyncThunk(
  "inventory/transferOut",
  async (
    {
      id,
      data,
      idempotencyKey,
    }: {
      id: string;
      data: { quantity: number; reason?: string; destination_cinema_id: string; destination_inventory_id: string };
      idempotencyKey: string;
    },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Inventory.transferOut(id, data, idempotencyKey);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        response: error.response?.data,
      }) as any;
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    inventories: [],
    history: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllInventories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllInventories.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getInventoryHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInventoryHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload || [];
      })
      .addCase(getInventoryHistory.rejected, (state) => {
        state.loading = false;
      })
      .addCase(stockIn.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(recordSpoilage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(correctInventory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(transferOut.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteInventory.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default inventorySlice.reducer;
