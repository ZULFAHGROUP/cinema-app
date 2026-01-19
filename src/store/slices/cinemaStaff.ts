/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Staff from "../../services/network/staff";

export const getCinemaStaff = createAsyncThunk(
  "cinemaStaff/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await Staff.getCinemaStaff(page, limit);
      return {
        data: response.data.data.users,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const assignCinemaStaff = createAsyncThunk(
  "cinemaStaff/assign",
  async (payload: { cinema_id: string; user_id: string }, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Staff.assignCinemaStaff(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const removeCinemaStaff = createAsyncThunk(
  "cinemaStaff/remove",
  async (payload: { cinema_id: string; user_id: string }, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Staff.removeCinemaStaff(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const cinemaStaffSlice = createSlice({
  name: "cinemaStaff",
  initialState: {
    cinemaStaffList: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCinemaStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCinemaStaff.fulfilled, (state, action) => {
      state.loading = false;
        state.cinemaStaffList = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;})
      .addCase(getCinemaStaff.rejected, (state) => {
        state.loading = false;
      })
      .addCase(assignCinemaStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignCinemaStaff.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignCinemaStaff.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeCinemaStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCinemaStaff.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeCinemaStaff.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default cinemaStaffSlice.reducer;
