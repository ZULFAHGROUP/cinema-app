/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Staff from "../../services/network/staff";

export const getAllStaff = createAsyncThunk(
  "staff/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await Staff.allStaff(page, limit);
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
    staff: [],
    staffLoading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllStaff.pending, (state) => {
        state.staffLoading = true;
      })
      .addCase(getAllStaff.fulfilled, (state, action) => {
        state.staffLoading = false;
        state.staff = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllStaff.rejected, (state) => {
        state.staffLoading = false;
      })
      .addCase(createStaff.pending, (state) => {
        state.staffLoading = true;
      })
      .addCase(createStaff.fulfilled, (state) => {
        state.staffLoading = false;
      })
      .addCase(updateStaff.fulfilled, (state) => {
        state.staffLoading = false;
      })
      .addCase(deleteStaff.fulfilled, (state) => {
        state.staffLoading = false;
      });
  },
});

export default staffSlice.reducer;
