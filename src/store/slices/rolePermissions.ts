/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import RolePermissions from "../../services/network/rolePermissions";

export const getAllRolePermissions = createAsyncThunk(
  "rolePermission/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      // Every role with its permission names, unpaginated: [{ role_name, permissions }]
      const response = await RolePermissions.allRolePermissions(page, limit);
      const roles = response.data.data || [];
      return {
        data: roles,
        page,
        limit,
        total: roles.length,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createRolePermission = createAsyncThunk(
  "rolePermission/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await RolePermissions.createRolePermission(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        response: error.response?.data,
      }) as any;
    }
  }
);

const rolePermissionSlice = createSlice({
  name: "rolePermission",
  initialState: {
    rolePermissions: [],
    rolePermissionLoading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllRolePermissions.pending, (state) => {
        state.rolePermissionLoading = true;
      })
      .addCase(getAllRolePermissions.fulfilled, (state, action) => {
        state.rolePermissionLoading = false;
        state.rolePermissions = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllRolePermissions.rejected, (state) => {
        state.rolePermissionLoading = false;
      })
      .addCase(createRolePermission.pending, (state) => {
        state.rolePermissionLoading = true;
      })
      .addCase(createRolePermission.fulfilled, (state) => {
        state.rolePermissionLoading = false;
      });
  },
});

export default rolePermissionSlice.reducer;
