/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import VatConfig from "../../services/network/vatConfig";

export const getAllVatConfigs = createAsyncThunk(
  "vatConfig/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await VatConfig.allVatConfigs(page, limit);
      return {
        data: response.data.data.vat_configs,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createVatConfig = createAsyncThunk(
  "vatConfig/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await VatConfig.createVatConfig(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updateVatConfig = createAsyncThunk(
  "vatConfig/update",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await VatConfig.updateVatConfig(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deleteVatConfig = createAsyncThunk(
  "vatConfig/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await VatConfig.deleteVatConfig(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const vatConfigSlice = createSlice({
  name: "vatConfig",
  initialState: {
    vatConfigs: [],
    vatLoading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllVatConfigs.pending, (state) => {
        state.vatLoading = true;
      })
      .addCase(getAllVatConfigs.fulfilled, (state, action) => {
        state.vatLoading = false;
        state.vatConfigs = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllVatConfigs.rejected, (state) => {
        state.vatLoading = false;
      })
      .addCase(createVatConfig.pending, (state) => {
        state.vatLoading = true;
      })
      .addCase(createVatConfig.fulfilled, (state) => {
        state.vatLoading = false;
      })
      .addCase(updateVatConfig.fulfilled, (state) => {
        state.vatLoading = false;
      })
      .addCase(deleteVatConfig.fulfilled, (state) => {
        state.vatLoading = false;
      });
  },
});

export default vatConfigSlice.reducer;
