/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import MovieClassification from "../../services/network/classification";

export const getAllClassifications = createAsyncThunk(
  "classification/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await MovieClassification.allMovieClassification(
        page,
        limit
      );
      return {
        data: response.data.data.moviesClassification,
        page,
        limit,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createClassification = createAsyncThunk(
  "classification/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await MovieClassification.createMovieClassification(
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updateClassification = createAsyncThunk(
  "classification/update",
  async (
    { id, payload }: { id: string | number; payload: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await MovieClassification.updateMovieClassification(
        id,
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deleteClassification = createAsyncThunk(
  "classification/delete",
  async (id: string | number, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await MovieClassification.deleteMovieClassification(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const classificationSlice = createSlice({
  name: "classification",
  initialState: {
    classifications: [],
    loading: false,
    error: null,
    limit: 10,
    page: 1,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClassifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllClassifications.fulfilled, (state, action) => {
        state.loading = false;
        state.classifications = action.payload.data;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllClassifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      });
  },
});

export default classificationSlice.reducer;
