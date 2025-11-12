// resetPasswordSlice.js
import { createSlice /* createAsyncThunk (kept if used elsewhere) */ } from '@reduxjs/toolkit';
import { CADRE_URLS } from '../../constants';

const initialState = {
  resetPasswordSuccess: null,
  resetPasswordResponse: {},
  resetPasswordForRegister: false,
};

// OPTIONAL (legacy) thunk — WARNING: passing args to thunks exposes them in meta.
// Kept for backward compatibility but NOT used by CreatePassword anymore.
/*
export const resetPassword = createAsyncThunk('/resetPassword', async (data, { getState }) => {
  const token = getState()?.verifyOtp?.verifyOtpResponse2?.data?.token;
  const res = await fetch(`${CADRE_URLS.user}/resetPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data), // <-- contains secret if you call with {password}
    credentials: 'include',
  });
  const json = await res.json();
  return json;
});
*/

// NEW: plain helper that does NOT touch Redux and does NOT expose args to actions
export async function postResetPassword(data, token) {
  const res = await fetch(`${CADRE_URLS.user}/resetPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(data), // contains the password, but never enters Redux
    credentials: 'include',
  });

  let json = null;
  try {
    json = await res.json();
  } catch (_) {
    // tolerate empty body
  }

  return { status: res.status, json };
}

export const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState,
  reducers: {
    registerFlowFlag: (state, action) => {
      state.resetPasswordForRegister = action.payload;
    },
    resetPasswordResponseObj: (state, action) => {
      // store only the server response (no secrets)
      state.resetPasswordResponse = action.payload;
    },
    resetPasswordUser: (state, action) => {
      // if other parts of the app need a flag, keep it boolean-only
      state.resetPasswordSuccess = action.payload === true;
    },
  },
  // If you still use the thunk elsewhere, you can keep extraReducers below.
  /*
  extraReducers: (builder) => {
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
      state.resetPasswordSuccess = null;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.resetPasswordSuccess = true;
      state.resetPasswordResponse = action.payload; // response only
    });
    builder.addCase(resetPassword.rejected, (state) => {
      state.isLoading = false;
      state.resetPasswordSuccess = false;
    });
  },
  */
});

export const {
  resetPasswordUser,
  registerFlowFlag,
  resetPasswordResponseObj,
} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;