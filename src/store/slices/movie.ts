/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Movie, { MovieFilters } from "../../services/network/movie";

export const getAllMovies = createAsyncThunk(
  "movie/getAll",
  async (
    { page = 1, limit = 10, filters }: { page?: number; limit?: number; filters?: MovieFilters },
    { rejectWithValue }
  ) => {
    // Other pages (tickets, price rules) also list movies, so filters are never implied.
    const activeFilters = filters ?? {};
    try {
      const response = await Movie.allMovies(page, limit, activeFilters);
      return {
        data: response.data.data.movies,
        page,
        limit,
        total: response.data.data.pagination.total,
        stats: response.data.data.stats,
        filters: activeFilters,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createMovie = createAsyncThunk(
  "movie/create",
  async (payload: any, { rejectWithValue }): Promise<ApiResponse> => {
    try {
      const response = await Movie.createMovie(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        response: error.response?.data,
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
        message: error.message,
        response: error.response?.data,
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
        message: error.message,
        response: error.response?.data,
      }) as any;
    }
  }
);

const movieSlice = createSlice({
  name: "movie",
  initialState: {
    movies: [] as any[],
    moviesLoading: false,
    error: null,page:1,limit:10,total:0,
    stats: null as { total_movies: number; active_movies: number; inactive_movies: number } | null,
    filters: {} as MovieFilters,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMovies.pending, (state) => {
        state.moviesLoading = true;
      })
      .addCase(getAllMovies.fulfilled, (state, action) => {
        state.moviesLoading = false;
        state.movies = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.stats = action.payload.stats || null;
        state.filters = action.payload.filters;
      })
      .addCase(getAllMovies.rejected, (state) => {
        state.moviesLoading = false;
      })
      .addCase(createMovie.pending, (state) => {
        state.moviesLoading = true;
      })
      .addCase(createMovie.fulfilled, (state) => {
        state.moviesLoading = false;
      })
      .addCase(updateMovie.fulfilled, (state) => {
        state.moviesLoading = false;
      })
      .addCase(deleteMovie.fulfilled, (state) => {
        state.moviesLoading = false;
      });
  },
});

export default movieSlice.reducer;
