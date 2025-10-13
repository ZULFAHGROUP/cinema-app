/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SeatTypes from "../../services/network/seatType";
import { ApiResponse } from "../../@types/common";

interface SeatTypeState {
  seatTypes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SeatTypeState = {
  seatTypes: [],
  loading: false,
  error: null,
};

export const getAllSeatTypes = createAsyncThunk(
  "seatType/getAllSeatTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await SeatTypes.allSeatType();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ CREATE SEAT TYPE
export const createSeatType = createAsyncThunk(
  "seatType/createSeatType",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await SeatTypes.createSeatType(payload);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

// ✅ UPDATE SEAT TYPE
export const updateSeatType = createAsyncThunk(
  "seatType/updateSeatType",
  async (
    { id, payload }: { id: string | number; payload: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await SeatTypes.updateSeatType(id, payload);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

// ✅ DELETE SEAT TYPE
export const deleteSeatType = createAsyncThunk(
  "seatType/deleteSeatType",
  async (id: string | number, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await SeatTypes.deleteSeatType(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const seatTypeSlice = createSlice({
  name: "seatType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getAllSeatTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSeatTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.seatTypes = action.payload || [];
      })
      .addCase(getAllSeatTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createSeatType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSeatType.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSeatType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateSeatType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSeatType.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSeatType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteSeatType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSeatType.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteSeatType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default seatTypeSlice.reducer;
