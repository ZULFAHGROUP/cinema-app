/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Purchase from "../../services/network/purchase";

export const initiatePurchase = createAsyncThunk(
  "purchase/initiate",
  async (
    { payload, idempotencyKey }: { payload: any; idempotencyKey: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await Purchase.initiate(payload, idempotencyKey);
      return response.data;
    } catch (error: any) {
      // 409: not enough seats, or a chosen seat was just taken.
      return rejectWithValue({ message: error.message, statusCode: error.response?.status });
    }
  }
);

interface PurchaseState {
  initiateLoading: boolean;
  initiateData: any;
  error: any;
}

const initialState: PurchaseState = {
  initiateLoading: false,
  initiateData: null,
  error: null,
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    resetPurchase: (state) => {
      state.initiateData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePurchase.pending, (state) => {
        state.initiateLoading = true;
        state.error = null;
      })
      .addCase(initiatePurchase.fulfilled, (state, action) => {
        state.initiateLoading = false;
        state.initiateData = action.payload.data;
      })
      .addCase(initiatePurchase.rejected, (state, action) => {
        state.initiateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPurchase } = purchaseSlice.actions;
export default purchaseSlice.reducer;
