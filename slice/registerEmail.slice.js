// registerEmailSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { CADRE_URLS } from '../../constants';

/**
 * Never store the raw email in Redux.
 * If you must show it in the UI (e.g., “we emailed code to aa****@domain.com”),
 * store only a masked version.
 */
export const maskEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  const [local, domain] = email.split('@');
  if (!domain) return '';
  const head = local.slice(0, Math.min(2, local.length));
  const tail = local.slice(-1);
  const stars = '*'.repeat(Math.max(2, local.length - head.length - tail.length));
  return `${head}${stars}${tail}@${domain}`;
};

/**
 * Plain helper for the network call.
 * IMPORTANT: This does NOT dispatch and does NOT touch Redux with the raw email.
 * Call this directly from the component.
 */
export async function postRegisterEmail({ email, flow = 'register' }, token) {
  // Keep your existing endpoint shape. If backend expects a different path,
  // change only the path below — behavior remains identical.
  const url =
    flow === 'register'
      ? `${CADRE_URLS.user}/registerEmail`
      : `${CADRE_URLS.user}/forgotPasswordEmail`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    // allow empty body
  }
  return { status: res.status, json };
}

/**
 * Redux slice: stores only non-sensitive UI flags and masked email + last response.
 * No raw email and no secrets are ever put in actions or state.
 */
const initialState = {
  maskedEmail: '',            // masked only, e.g., "ma****e@site.com"
  flowIsRegister: true,       // true=register, false=forgot-password
  isLoading: false,           // optional flag for spinners
  lastResponse: {},           // server response sans PII
};

export const registerEmailSlice = createSlice({
  name: 'registerEmail',
  initialState,
  reducers: {
    // Keep this action name so existing imports continue to work, but
    // DO NOT pass the raw email as payload when dispatching.
    setMaskedEmail(state, action) {
      state.maskedEmail = action.payload || '';
    },
    registerFlowFlag(state, action) {
      state.flowIsRegister = !!action.payload;
    },
    registerEmailResponseObj(state, action) {
      state.lastResponse = action.payload || {};
    },
    setLoading(state, action) {
      state.isLoading = !!action.payload;
    },
  },
});

export const {
  setMaskedEmail,
  registerFlowFlag,
  registerEmailResponseObj,
  setLoading,
} = registerEmailSlice.actions;

export default registerEmailSlice.reducer;

/* -----------------------------
   Legacy async thunk (optional)
   -----------------------------
   If some old code still calls a thunk named `registerEmail`, keep a thin
   wrapper that DOES NOT expose the raw email in any Redux action by
   not including it as payload. Prefer calling `postRegisterEmail` directly.
*/
// Example (commented out to avoid accidental use):
// import { createAsyncThunk } from '@reduxjs/toolkit';
// export const registerEmail = createAsyncThunk(
//   'registerEmail/request',
//   async ({ email, flow, token }, { dispatch }) => {
//     dispatch(setLoading(true));
//     const { status, json } = await postRegisterEmail({ email, flow }, token);
//     dispatch(setLoading(false));
//     dispatch(registerEmailResponseObj(json || {}));
//     dispatch(setMaskedEmail(maskEmail(email))); // masked only
//     return { status };
//   }
// );
