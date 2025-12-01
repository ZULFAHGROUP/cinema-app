/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import ScreenTypes from "../../services/network/screenType";

interface ScreenTypeState {
  screenTypes: any[];
  loading: boolean;
  error: string | null;
  total?: number;
  page?: number;
  limit?: number;
}

const initialState: ScreenTypeState = {
  screenTypes: [],
  loading: false,
  total: 0,
  page: 1,
  limit: 10,
  error: null,
};

export const getAllScreenTypes = createAsyncThunk(
  "seatType/getAllSeatTypes",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await ScreenTypes.allScreenType(page, limit);
      return {
        data: response.data.data.screenTypes,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ CREATE SEAT TYPE
export const createScreenType = createAsyncThunk(
  "seatType/createSeatType",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await ScreenTypes.createScreenType(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

// ✅ UPDATE SEAT TYPE
export const updateScreenType = createAsyncThunk(
  "seatType/updateSeatType",
  async (
    { id, payload }: { id: string | number; payload: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await ScreenTypes.updateScreenType(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

// ✅ DELETE SEAT TYPE
export const deleteScreenType = createAsyncThunk(
  "seatType/deleteSeatType",
  async (id: string | number, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await ScreenTypes.deleteScreenType(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const screenTypeSlice = createSlice({
  name: "seatType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getAllScreenTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllScreenTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.screenTypes = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllScreenTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createScreenType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createScreenType.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createScreenType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateScreenType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateScreenType.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateScreenType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteScreenType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteScreenType.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteScreenType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default screenTypeSlice.reducer;
