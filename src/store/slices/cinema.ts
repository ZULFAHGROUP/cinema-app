/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Cinema from "../../services/network/cinema";
import { toast } from "react-toastify";

const initialState: any = {
  cinemaLoading: false,
  cinemaError: null,
  createCinema: {},
  allCinemas: {},
  deleteCinema: {},
};

export const createCinema = createAsyncThunk(
  "cinema/create",
  async (payload: FormData): Promise<ApiResponse> => {
    const response = await Cinema.createCinema(payload);
    return response.data;
  }
);

export const getAllCinemas = createAsyncThunk(
  "cinema/getAllCinemas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Cinema.allCinemas();
      console.log("response from Api", response);
      return response.data;
    } catch (error: any) {
      toast.error(error.message);
      console.log("error is", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCinema = createAsyncThunk(
  "cinema/deleteCinema",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Cinema.deleteCinema(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const cinemaSlice = createSlice({
  name: "cinema",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCinema.pending, (state) => {
        state.cinemaLoading = true;
        state.cinemaError = null;
      })
      .addCase(createCinema.fulfilled, (state, action: PayloadAction<any>) => {
        state.createCinema = action.payload;
        state.cinemaLoading = false;
        state.cinemaError = null;
      })
      .addCase(createCinema.rejected, (state, action) => {
        state.data = initialState.createCinema;
        state.cinemaLoading = false;
        state.cinemaError = action.error.message || String(action.error);
      })
      .addCase(getAllCinemas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCinemas.fulfilled, (state, action: PayloadAction<any>) => {
        state.allCinemas = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllCinemas.rejected, (state, action) => {
        state.allCinemas = initialState.allCinemas;
        state.loading = false;
        state.error = action.error.message || String(action.error);
      })
      .addCase(deleteCinema.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCinema.fulfilled, (state, action: PayloadAction<any>) => {
        state.deleteCinema = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCinema.rejected, (state, action) => {
        state.deleteCinema = initialState.deleteCinema;
        state.loading = false;
        state.error = action.error.message || String(action.error);
      });
  },
});

export default cinemaSlice.reducer;
