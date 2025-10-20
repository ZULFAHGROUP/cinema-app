/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Seats from "../../services/network/seat";

interface SeatTypeState {
  seats: any[];
  seatLoading: boolean;
  error: string | null;
}

const initialState: SeatTypeState = {
  seats: [],
  seatLoading: false,
  error: null,
};

export const getAllSeats = createAsyncThunk(
  "seat/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Seats.allSeat();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ CREATE SEAT
export const createSeat = createAsyncThunk(
  "seat/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Seats.createSeat(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

// ✅ UPDATE SEAT
export const updateSeat = createAsyncThunk(
  "seat/update",
  async (
    { id, payload }: { id: string | number; payload: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Seats.updateSeat(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

// ✅ DELETE SEAT
export const deleteSeat = createAsyncThunk(
  "seat/delete",
  async (id: string | number, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Seats.deleteSeat(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const seatSlice = createSlice({
  name: "seat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getAllSeats.pending, (state) => {
        state.seatLoading = true;
      })
      .addCase(getAllSeats.fulfilled, (state, action) => {
        state.seatLoading = false;
        state.seats = action.payload || [];
      })
      .addCase(getAllSeats.rejected, (state, action) => {
        state.seatLoading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createSeat.pending, (state) => {
        state.seatLoading = true;
      })
      .addCase(createSeat.fulfilled, (state) => {
        state.seatLoading = false;
      })
      .addCase(createSeat.rejected, (state, action) => {
        state.seatLoading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateSeat.pending, (state) => {
        state.seatLoading = true;
      })
      .addCase(updateSeat.fulfilled, (state) => {
        state.seatLoading = false;
      })
      .addCase(updateSeat.rejected, (state, action) => {
        state.seatLoading = false;
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteSeat.pending, (state) => {
        state.seatLoading = true;
      })
      .addCase(deleteSeat.fulfilled, (state) => {
        state.seatLoading = false;
      })
      .addCase(deleteSeat.rejected, (state, action) => {
        state.seatLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default seatSlice.reducer;
