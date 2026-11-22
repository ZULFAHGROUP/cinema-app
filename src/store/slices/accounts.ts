/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Accounts from "../../services/network/accounts";
import { AuthState } from "../../@types/common";

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

/** Admin wins so `role` checks ("is this an admin?") see the widest role. */
const primaryRole = (roles: string[] = []) =>
  roles.find((role) => role.toLowerCase() === "admin") || roles[0] || "";

export const login = createAsyncThunk(
  "account/login",
  async (payload: { email: string; password: string }) => {
    const response = await Accounts.login(payload);
    const { token, admin } = response.data.data;

    // The store has no token yet, so load the profile (assigned cinema) with this one.
    const profile = await Accounts.getProfile({
      headers: { Authorization: `Bearer ${token}` },
    });
    const cinema = profile.data.data?.cinema || null;

    return {
      jwtToken: token,
      user: {
        ...admin,
        role: primaryRole(admin.roles),
        cinema,
        cinema_id: cinema?.cinema_id || "",
      },
      status: true,
    };
  }
);

/** Revokes the token on the server; the local session is cleared either way. */
export const signOut = createAsyncThunk("account/signOut", async () => {
  try {
    await Accounts.logout();
  } catch {
    // An expired or revoked token is already signed out.
  }
});

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
      .addCase(signOut.fulfilled, (state) => {
        state.data = initialState.data;
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
