/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import ShowTime from "../../services/network/showtime";

export const getAllShowtimes = createAsyncThunk(
  "showtime/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ShowTime.allShowtimes();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createShowtime = createAsyncThunk(
  "showtime/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await ShowTime.createShowtime(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updateShowtime = createAsyncThunk(
  "showtime/update",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await ShowTime.updateShowtime(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deleteShowtime = createAsyncThunk(
  "showtime/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await ShowTime.deleteShowtime(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const showtimeSlice = createSlice({
  name: "showtime",
  initialState: {
    showtimes: [],
    showtimeLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllShowtimes.pending, (state) => {
        state.showtimeLoading = true;
      })
      .addCase(getAllShowtimes.fulfilled, (state, action) => {
        state.showtimeLoading = false;
        state.showtimes = action.payload || [];
      })
      .addCase(getAllShowtimes.rejected, (state) => {
        state.showtimeLoading = false;
      })
      .addCase(createShowtime.pending, (state) => {
        state.showtimeLoading = true;
      })
      .addCase(createShowtime.fulfilled, (state) => {
        state.showtimeLoading = false;
      })
      .addCase(updateShowtime.fulfilled, (state) => {
        state.showtimeLoading = false;
      })
      .addCase(deleteShowtime.fulfilled, (state) => {
        state.showtimeLoading = false;
      });
  },
});

export default showtimeSlice.reducer;
