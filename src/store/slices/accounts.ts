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
    const profileData = profile.data.data || {};
    const cinema = profileData.cinema || null;

    return {
      jwtToken: token,
      user: {
        ...admin,
        ...profileData,
        role: primaryRole(admin.roles),
        cinema,
        cinema_id: cinema?.cinema_id || "",
      },
      status: true,
    };
  }
);

export const refreshProfile = createAsyncThunk(
  "account/refreshProfile",
  async () => {
    const profile = await Accounts.getProfile();
    const profileData = profile.data.data || {};
    const cinema = profileData.cinema || null;
    const roleNames = Array.isArray(profileData.roles)
      ? profileData.roles.map((r: any) => (typeof r === "string" ? r : r.role_name))
      : [];
    return {
      ...profileData,
      role: primaryRole(roleNames),
      cinema,
      cinema_id: cinema?.cinema_id || "",
    };
  }
);

export const switchCinemaContext = createAsyncThunk(
  "account/switchCinemaContext",
  async ({ cinema_id, cinema }: { cinema_id: string; cinema?: any }) => {
    const response = await Accounts.switchContext(cinema_id);
    const { token } = response.data.data;
    return { jwtToken: token, cinema_id, cinema };
  }
);

export const exitCinemaContext = createAsyncThunk(
  "account/exitCinemaContext",
  async () => {
    const response = await Accounts.exitSwitchContext();
    const { token } = response.data.data;
    return { jwtToken: token };
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
      })
      .addCase(refreshProfile.fulfilled, (state, action: PayloadAction<any>) => {
        if (state.data.user) {
          state.data.user = {
            ...state.data.user,
            ...action.payload,
          };
        }
      })
      .addCase(switchCinemaContext.fulfilled, (state, action: PayloadAction<any>) => {
        state.data.jwtToken = action.payload.jwtToken;
        if (state.data.user) {
          state.data.user.scoped_cinema_id = action.payload.cinema_id;
          state.data.user.scoped_cinema = action.payload.cinema || null;
        }
      })
      .addCase(exitCinemaContext.fulfilled, (state, action: PayloadAction<any>) => {
        state.data.jwtToken = action.payload.jwtToken;
        if (state.data.user) {
          state.data.user.scoped_cinema_id = "";
          state.data.user.scoped_cinema = null;
        }
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
