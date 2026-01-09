/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Accounts from "../../services/network/accounts";
import { ApiResponse, AuthState } from "../../@types/common";

const initialState: AuthState = {
  loginLoading: false,
  loginError: null,
  data: {
    id: "",
    isPasswordChangeRequired: false,
    accountDetails: {
      id: "",
      title: "",
      surname: "",
      othername: "",
      gender: null,
      maidenName: "",
      signature: null,
      approvedSelfie: null,
      phoneNumber: "",
      email: "",
      dateOfBirth: "",
      nationality: "",
      state: "",
      lga: "",
      occupation: "",
      employerName: "",
      employerAddress: "",
      employerPhoneNumber: "",
      role:'',
      cinema_id:''
    },
    jwtToken: null,
    sessionTimedOut: false,
  },
};

export const login = createAsyncThunk(
  "account/login",
  async (payload: FormData): Promise<ApiResponse> => {
    const response = await Accounts.login(payload);
    const data = {
      jwtToken: response.headers.authorization,
      user: response.data.data,
      status: response.status === 200,
    };
    return data;
  }
);

export const resumeSession = createAsyncThunk(
  "account/resumeSession",
  async (payload) => {
    const response = await Accounts.login(payload);
    const data = response.data.data;
    data.sessionTimedOut = false;
    data.jwtToken = response.headers["token"];
    return data;
  }
);

// export const resetPassword = createAsyncThunk(
//   "account/resetPassword",
//   async (payload) => {
//     const response = await Accounts.resetPassword(payload);
//     return response.data.data;
//   }
// );

// export const updateProfile = createAsyncThunk(
//   "account/updateProfile",
//   async (payload) => {
//     const response = await Accounts.updateProfile(payload);
//     return response.data.data;
//   }
// );

// export const changePassword = createAsyncThunk(
//   "account/changePassword",
//   async (payload) => {
//     const response = await Accounts.changePassword(payload);
//     return response.data.data;
//   }
// );

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    timeOutAccountSession: (state) => {
      state.data.jwtToken = null;
      state.data.sessionTimedOut = true;
    },
    logout: (state) => {
      state.data = initialState.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.loginLoading = false;
        state.loginError = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.data = initialState.data;
        state.loginLoading = false;
        state.loginError = action.error.message || String(action.error);
      })
      .addCase(resumeSession.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
      });
    // .addCase(updateProfile.fulfilled, (state, action: PayloadAction<any>) => {
    //   console.log(action.payload);
    //   state.data.customerDetails = {
    //     ...state.data.customerDetails,
    //     ...action.payload,
    //   };
    // });
  },
});

export const { timeOutAccountSession, logout } = accountSlice.actions;

export default accountSlice.reducer;
