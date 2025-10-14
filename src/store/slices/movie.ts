/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Movie from "../../services/network/movie";

export const getAllMovies = createAsyncThunk(
  "showtimeStatus/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Movie.allMovies();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createMovie = createAsyncThunk(
  "movie/create",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Movie.createMovie(id, payload);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const updateMovie = createAsyncThunk(
  "movie/update",
  async (
    { id, data: payload }: { id: string; data: any },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Movie.updateMovie(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

export const deleteMovie = createAsyncThunk(
  "movie/delete",
  async (id: string, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Movie.deleteMovie(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

const movieSlice = createSlice({
  name: "movie",
  initialState: {
    movies: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload || [];
      })
      .addCase(getAllMovies.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMovie.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMovie.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteMovie.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default movieSlice.reducer;
