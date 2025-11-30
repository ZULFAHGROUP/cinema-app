/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Extras from "../../services/network/extras";

// export const getAllAuditTrails = createAsyncThunk(
//   "role/getAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await Extras.allAuditTrails();
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

export const getAllAuditTrails = createAsyncThunk(
  "extras/getAllAuditTrails",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await Extras.allAuditTrails(page, limit);
      return {
        data: response.data.data.audits,
        page,
        limit,
        // total: 200,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// const extrasSlice = createSlice({
//   name: "extras",
//   initialState: {
//     auditTrails: [],
//     auditLoading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllAuditTrails.pending, (state) => {
//         state.auditLoading = true;
//       })
//       .addCase(getAllAuditTrails.fulfilled, (state, action) => {
//         state.auditLoading = false;
//         state.auditTrails = action.payload || [];
//       })
//       .addCase(getAllAuditTrails.rejected, (state) => {
//         state.auditLoading = false;
//       });
//   },
// });

const extrasSlice = createSlice({
  name: "extras",
  initialState: {
    auditTrails: [] as any[],
    auditLoading: false,
    total: 0,
    page: 1,
    limit: 10,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAuditTrails.pending, (state) => {
        state.auditLoading = true;
      })
      .addCase(getAllAuditTrails.fulfilled, (state, action) => {
        state.auditLoading = false;
        state.auditTrails = action.payload.data;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(getAllAuditTrails.rejected, (state) => {
        state.auditLoading = false;
      });
  },
});

export default extrasSlice.reducer;
