/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ShowtimeStatus from "../../services/network/showtimeStatus";
import { ApiResponse } from "../../@types/common";

export const getAllShowtimeStatuses = createAsyncThunk(
  "showtimeStatus/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await ShowtimeStatus.allShowtimeStatuses(page, limit);
      return {
        data: response.data.data.showtimeStatuses,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createShowtimeStatus = createAsyncThunk(
  "showtimeStatus/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await ShowtimeStatus.createShowtimeStatus(payload);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updateShowtimeStatus = createAsyncThunk(
  "showtimeStatus/update",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await ShowtimeStatus.updateShowtimeStatus(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deleteShowtimeStatus = createAsyncThunk(
  "showtimeStatus/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await ShowtimeStatus.deleteShowtimeStatus(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const showtimeStatusSlice = createSlice({
  name: "showtimeStatus",
  initialState: {
    statuses: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllShowtimeStatuses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllShowtimeStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllShowtimeStatuses.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createShowtimeStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(createShowtimeStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateShowtimeStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteShowtimeStatus.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default showtimeStatusSlice.reducer;
