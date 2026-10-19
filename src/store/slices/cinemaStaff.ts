/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Staff, { AssignmentFilters } from "../../services/network/staff";

export interface AssignmentStats {
  total_assignments: number;
  cinemas_staffed: number;
  managers: number;
  staff: number;
  pos_cashiers: number;
  /** Active non-Admin staff with no cinema; not narrowed by the filters. */
  unassigned_staff: number;
}

export const getCinemaStaff = createAsyncThunk(
  "cinemaStaff/getAll",
  async (
    { page = 1, limit = 10, filters }: { page?: number; limit?: number; filters?: AssignmentFilters },
    { rejectWithValue, getState }
  ) => {
    // Refreshes after assigning or removing pass no filters: keep the ones on screen.
    const activeFilters = filters ?? (getState() as any).cinemaStaff.filters ?? {};
    try {
      const response = await Staff.getCinemaStaff(page, limit, activeFilters);
      return {
        data: response.data.data.assignments,
        page,
        limit,
        total: response.data.data.pagination.total,
        stats: response.data.data.stats as AssignmentStats,
        filters: activeFilters,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const assignCinemaStaff = createAsyncThunk(
  "cinemaStaff/assign",
  async (payload: { cinema_id: string; admin_id: string }, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Staff.assignCinemaStaff(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        response: error.response?.data,
      }) as any;
    }
  }
);

export const removeCinemaStaff = createAsyncThunk(
  "cinemaStaff/remove",
  async (payload: { cinema_id: string; admin_id: string }, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Staff.removeCinemaStaff(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        response: error.response?.data,
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
    stats: null as AssignmentStats | null,
    filters: {} as AssignmentFilters,
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
        state.total = action.payload.total;
        state.stats = action.payload.stats || null;
        state.filters = action.payload.filters;
      })
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
