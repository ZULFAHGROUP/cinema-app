/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Seats, { SeatLayoutRow } from "../../services/network/seat";

interface SeatState {
  screenSeats: any[];
  screenSeatsLoading: boolean;
  showtimeSeatMap: { showtime_id: string; has_seat_map: boolean; seats: any[] } | null;
  showtimeSeatsLoading: boolean;
  error: string | null;
}

const initialState: SeatState = {
  screenSeats: [],
  screenSeatsLoading: false,
  showtimeSeatMap: null,
  showtimeSeatsLoading: false,
  error: null,
};

export const getScreenSeats = createAsyncThunk(
  "seat/getScreenSeats",
  async (screenId: string, { rejectWithValue }) => {
    try {
      const response = await Seats.getScreenSeats(screenId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({ message: error.message, response: error.response?.data });
    }
  }
);

export const saveScreenSeats = createAsyncThunk(
  "seat/saveScreenSeats",
  async (
    { screenId, rows }: { screenId: string; rows: SeatLayoutRow[] },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Seats.saveScreenSeats(screenId, rows);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        response: error.response?.data,
      }) as any;
    }
  }
);

export const getShowtimeSeats = createAsyncThunk(
  "seat/getShowtimeSeats",
  async (showtimeId: string, { rejectWithValue }) => {
    try {
      const response = await Seats.getShowtimeSeats(showtimeId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({ message: error.message, response: error.response?.data });
    }
  }
);

const seatSlice = createSlice({
  name: "seat",
  initialState,
  reducers: {
    clearShowtimeSeats: (state) => {
      state.showtimeSeatMap = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getScreenSeats.pending, (state) => {
        state.screenSeatsLoading = true;
        state.screenSeats = [];
      })
      .addCase(getScreenSeats.fulfilled, (state, action) => {
        state.screenSeatsLoading = false;
        state.screenSeats = action.payload || [];
      })
      .addCase(getScreenSeats.rejected, (state) => {
        state.screenSeatsLoading = false;
      })
      .addCase(saveScreenSeats.fulfilled, (state, action) => {
        state.screenSeats = action.payload.data || [];
      })
      .addCase(getShowtimeSeats.pending, (state) => {
        state.showtimeSeatsLoading = true;
      })
      .addCase(getShowtimeSeats.fulfilled, (state, action) => {
        state.showtimeSeatsLoading = false;
        state.showtimeSeatMap = action.payload;
      })
      .addCase(getShowtimeSeats.rejected, (state) => {
        state.showtimeSeatsLoading = false;
        state.showtimeSeatMap = null;
      });
  },
});

export const { clearShowtimeSeats } = seatSlice.actions;
export default seatSlice.reducer;
