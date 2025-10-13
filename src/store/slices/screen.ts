/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Screens from "../../services/network/screens";

export const getAllScreen = createAsyncThunk(
  "screen/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Screens.allScreens();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createScreen = createAsyncThunk(
  "screen/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Screens.createScreen(payload);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updateScreen = createAsyncThunk(
  "screen/update",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Screens.updateScreen(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deleteScreen = createAsyncThunk(
  "screen/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Screens.deleteScreen(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const screenSlice = createSlice({
  name: "screen",
  initialState: {
    screens: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllScreen.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllScreen.fulfilled, (state, action) => {
        state.loading = false;
        state.screens = action.payload;
      })
      .addCase(getAllScreen.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createScreen.pending, (state) => {
        state.loading = true;
      })
      .addCase(createScreen.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateScreen.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteScreen.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default screenSlice.reducer;
