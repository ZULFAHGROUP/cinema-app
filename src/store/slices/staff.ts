/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Staff from "../../services/network/staff";

export const getManagers = createAsyncThunk(
  "staff/getManagers",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await Staff.getManagers(page, limit);
      return {
        data: response.data.data.managers,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getPosCashiers = createAsyncThunk(
  "staff/getPosCashiers",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await Staff.getPosCashiers(page, limit);
      return {
        data: response.data.data.posCashiers,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getGeneralStaff = createAsyncThunk(
  "staff/getGeneralStaff",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await Staff.getStaffs(page, limit);
      return {
        data: response.data.data.staffs,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createStaff = createAsyncThunk(
  "staff/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Staff.createStaff(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updateStaff = createAsyncThunk(
  "staff/update",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Staff.updateStaff(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deleteStaff = createAsyncThunk(
  "staff/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Staff.deleteStaff(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    managers: [],
    cashiers: [],
    generalStaff: [],
    loading: false,
    error: null,
    managersPagination: { page: 1, limit: 10, total: 0 },
    cashiersPagination: { page: 1, limit: 10, total: 0 },
    staffPagination: { page: 1, limit: 10, total: 0 },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Managers
      .addCase(getManagers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = action.payload.data || [];
        state.managersPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
        };
      })
      .addCase(getManagers.rejected, (state) => {
        state.loading = false;
      })
      // Cashiers
      .addCase(getPosCashiers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPosCashiers.fulfilled, (state, action) => {
        state.loading = false;
        state.cashiers = action.payload.data || [];
        state.cashiersPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
        };
      })
      .addCase(getPosCashiers.rejected, (state) => {
        state.loading = false;
      })
      // General Staff
      .addCase(getGeneralStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGeneralStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.generalStaff = action.payload.data || [];
        state.staffPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
        };
      })
      .addCase(getGeneralStaff.rejected, (state) => {
        state.loading = false;
      })
      // CUD operations
      .addCase(createStaff.pending, (state) => { state.loading = true; })
      .addCase(createStaff.fulfilled, (state) => { state.loading = false; })
      .addCase(updateStaff.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteStaff.fulfilled, (state) => { state.loading = false; });
  },
});

export default staffSlice.reducer;
