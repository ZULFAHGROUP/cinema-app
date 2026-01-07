/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Permissions from "../../services/network/permissions";

export const getAllPermissions = createAsyncThunk(
  "permission/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await Permissions.allPermissions(page, limit);
      return {
        data: response.data.data.permissions,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createPermission = createAsyncThunk(
  "permission/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Permissions.createPermission(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updatePermission = createAsyncThunk(
  "permission/update",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Permissions.updatePermission(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deletePermission = createAsyncThunk(
  "permission/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Permissions.deletePermission(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const permissionSlice = createSlice({
  name: "permission",
  initialState: {
    permissions: [],
    permissionLoading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPermissions.pending, (state) => {
        state.permissionLoading = true;
      })
      .addCase(getAllPermissions.fulfilled, (state, action) => {
        state.permissionLoading = false;
        state.permissions = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllPermissions.rejected, (state) => {
        state.permissionLoading = false;
      })
      .addCase(createPermission.pending, (state) => {
        state.permissionLoading = true;
      })
      .addCase(createPermission.fulfilled, (state) => {
        state.permissionLoading = false;
      })
      .addCase(updatePermission.fulfilled, (state) => {
        state.permissionLoading = false;
      })
      .addCase(deletePermission.fulfilled, (state) => {
        state.permissionLoading = false;
      });
  },
});

export default permissionSlice.reducer;
