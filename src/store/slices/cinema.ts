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

export const updateCinema = createAsyncThunk(
  "cinema/updateCinema",
  async (
    { id, payload }: { id: string | number; payload: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Cinema.updateCinema(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const getAllCinemas = createAsyncThunk(
  "cinema/getAllCinemas",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await Cinema.allCinemas(page, limit);
      console.log("response is", response);
      // return response.data.data;
      return {
        data: response.data.data.cinemas,
        page,
        limit,
        // total: 200,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCinema = createAsyncThunk(
  "cinema/deleteCinema",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Cinema.deleteCinema(id);
      return response.data;
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
        // state.cinemaLoading = true;
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
        state.cinemaLoading = true;
        state.error = null;
      })
      .addCase(getAllCinemas.fulfilled, (state, action: PayloadAction<any>) => {
        state.allCinemas = action.payload.data;
        state.cinemaLoading = false;
        state.error = null;
      })
      .addCase(getAllCinemas.rejected, (state, action) => {
        state.allCinemas = initialState.allCinemas;
        state.cinemaLoading = false;
        state.error = action.error.message || String(action.error);
      });
    // .addCase(deleteCinema.pending, (state) => {
    //   state.cinemaLoading = true;
    //   state.error = null;
    // })
    // .addCase(deleteCinema.fulfilled, (state, action: PayloadAction<any>) => {
    //   state.deleteCinema = action.payload;
    //   state.cinemaLoading = false;
    //   state.error = null;
    // })
    // .addCase(deleteCinema.rejected, (state, action) => {
    //   state.deleteCinema = initialState.deleteCinema;
    //   state.cinemaLoading = false;
    //   state.error = action.error.message || String(action.error);
    // });
  },
});

export default cinemaSlice.reducer;
