/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "../../@types/common";
import Screens from "../../services/network/screens";

// export const getAllScreen = createAsyncThunk(
//   "screen/getAll",
//   async (
//     {
//       screensPage = 1,
//       screensLimit = 10,
//     }: { screensPage?: number; screensLimit?: number },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await Screens.allScreens(screensPage, screensLimit);
//       return {
//         data: response.data.data.screens,
//         screensPage,
//         screensLimit,
//         total: response.data.data.pagination.total,
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

export const getAllScreen = createAsyncThunk(
  "screen/getAll",
  async (
    {
      screensPage = 1,
      screensLimit = 10,
      cinema_id,
    }: {
      screensPage?: number;
      screensLimit?: number;
      cinema_id: string | number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await Screens.allScreens(
        screensPage,
        screensLimit,
        cinema_id
      );
      return {
        data: response.data.data.screens,
        screensPage,
        screensLimit,
        cinema_id,
        total: response.data.data.pagination.total,
      };
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
      return response.data;
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
  async (
    { id, cinema_id }: { id: string; cinema_id: string },
    { rejectWithValue }
  ): Promise<ApiResponse> => {
    try {
      const response = await Screens.deleteScreen(id, cinema_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      }) as any;
    }
  }
);

// const screenSlice = createSlice({
//   name: "screen",
//   initialState: {
//     screens: [],
//     loading: false,
//     error: null,
//     screensPage: 1,
//     screensLimit: 10,
//     screensTotal: 10,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllScreen.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getAllScreen.fulfilled, (state, action) => {
//         state.loading = false;
//         state.screens = action.payload.data;
//         state.screensPage = action.payload.screensPage;
//         state.screensLimit = action.payload.screensLimit;
//         state.screensTotal = action.payload.total;
//       })
//       .addCase(getAllScreen.rejected, (state) => {
//         state.loading = false;
//       })
//       .addCase(createScreen.pending, (state) => {
//         state.loading = false;
//       })
//       .addCase(createScreen.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(updateScreen.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(deleteScreen.fulfilled, (state) => {
//         state.loading = false;
//       });
//   },
// });

// export default screenSlice.reducer;

const screenSlice = createSlice({
  name: "screen",
  initialState: {
    screensByCinema: {} as Record<string, any[]>, // Store screens per cinema
    loading: false,
    loadingCinemas: {} as Record<string, boolean>, // Track loading per cinema
    error: null,
    screensPage: 1,
    screensLimit: 10,
    screensTotal: 10,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllScreen.pending, (state, action) => {
        state.loading = true;
        const cinema_id = action.meta.arg.cinema_id;
        if (cinema_id) {
          state.loadingCinemas[cinema_id] = true;
        }
      })
      .addCase(getAllScreen.fulfilled, (state, action) => {
        state.loading = false;
        const cinema_id = action.payload.cinema_id;

        // Store screens for this specific cinema
        state.screensByCinema[cinema_id] = action.payload.data;
        state.loadingCinemas[cinema_id] = false;

        state.screensPage = action.payload.screensPage;
        state.screensLimit = action.payload.screensLimit;
        state.screensTotal = action.payload.total;
      })
      .addCase(getAllScreen.rejected, (state, action) => {
        state.loading = false;
        const cinema_id = action.meta.arg.cinema_id;
        if (cinema_id) {
          state.loadingCinemas[cinema_id] = false;
        }
      })
      .addCase(createScreen.pending, (state) => {
        state.loading = false;
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
