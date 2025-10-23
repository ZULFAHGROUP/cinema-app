/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Extras from "../../services/network/extras";

export const getAllAuditTrails = createAsyncThunk(
  "role/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Extras.allAuditTrails();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const extrasSlice = createSlice({
  name: "extras",
  initialState: {
    auditTrails: [],
    auditLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAuditTrails.pending, (state) => {
        state.auditLoading = true;
      })
      .addCase(getAllAuditTrails.fulfilled, (state, action) => {
        state.auditLoading = false;
        state.auditTrails = action.payload || [];
      })
      .addCase(getAllAuditTrails.rejected, (state) => {
        state.auditLoading = false;
      });
  },
});

export default extrasSlice.reducer;
