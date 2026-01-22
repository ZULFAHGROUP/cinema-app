/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import ShowTime from "../../services/network/showtime";

export const getAllShowtimes = createAsyncThunk(
  "showtime/getAll",
  async (
    { page = 1, limit = 10, cinema_id }: { page?: number; limit?: number; cinema_id?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await ShowTime.allShowtimes(page, limit, cinema_id);
      return {
        data: response.data.data.showtimes,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
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
  async (
    { id, cinema_id }: { id: string; cinema_id?: string },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await ShowTime.deleteShowtime(id, cinema_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const getShowtimePrice = createAsyncThunk(
  "showtime/getPrice",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await ShowTime.getShowtimePrice(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const showtimeSlice = createSlice({
  name: "showtime",
  initialState: {
    showtimes: [] as any[],
    showtimeLoading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
    selectedShowtimePrice: null as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllShowtimes.pending, (state) => {
        state.showtimeLoading = true;
      })
      .addCase(getAllShowtimes.fulfilled, (state, action) => {
        state.showtimeLoading = false;
        state.showtimes = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
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
      })
      .addCase(getShowtimePrice.pending, (state) => {
        state.showtimeLoading = true;
      })
      .addCase(getShowtimePrice.fulfilled, (state, action) => {
        state.showtimeLoading = false;
        state.selectedShowtimePrice = action.payload.data;
      })
      .addCase(getShowtimePrice.rejected, (state) => {
        state.showtimeLoading = false;
      });
  },
});

export default showtimeSlice.reducer;
