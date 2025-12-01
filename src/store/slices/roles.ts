/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Roles from "../../services/network/roles";

export const getAllRoles = createAsyncThunk(
  "role/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await Roles.allRoles(page, limit);
      return {
        data: response.data.data.roles,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createRole = createAsyncThunk(
  "role/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Roles.createRole(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updateRole = createAsyncThunk(
  "role/update",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Roles.updateRole(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deleteRole = createAsyncThunk(
  "role/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Roles.deleteRole(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState: {
    roles: [],
    roleLoading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllRoles.pending, (state) => {
        state.roleLoading = true;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.roleLoading = false;
        state.roles = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllRoles.rejected, (state) => {
        state.roleLoading = false;
      })
      .addCase(createRole.pending, (state) => {
        state.roleLoading = true;
      })
      .addCase(createRole.fulfilled, (state) => {
        state.roleLoading = false;
      })
      .addCase(updateRole.fulfilled, (state) => {
        state.roleLoading = false;
      })
      .addCase(deleteRole.fulfilled, (state) => {
        state.roleLoading = false;
      });
  },
});

export default roleSlice.reducer;
