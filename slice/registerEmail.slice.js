// src/app/actions/registerEmailSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { CADRE_URLS } from '../../constants';

/**
 * Mask PII before it ever touches Redux (e.g., "ma****e@site.com").
 */
export const maskEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  const parts = email.split('@');
  if (parts.length !== 2) return '';
  const [local, domain] = parts;

  if (local.length <= 2) return `${local[0] || ''}**@${domain}`;
  const head = local.slice(0, 2);
  const tail = local.slice(-1);
  const stars = '*'.repeat(Math.max(2, local.length - head.length - tail.length));
  return `${head}${stars}${tail}@${domain}`;
};

/**
 * Plain helper for the API call.
 * NOTE: This DOES NOT dispatch; it returns ({ status, json }) to the caller.
 * Call from components and then dispatch non-PII results.
 */
export async function postRegisterEmail({ email, flow = 'register' }, token) {
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
    body: JSON.stringify({ email }), // raw email goes only over TLS; never into Redux
  });

  let json = null;
  try { json = await res.json(); } catch (_) { /* allow empty */ }

  return { status: res.status, json };
}

const initialState = {
  maskedEmail: '',          // masked only, never the raw email
  flowIsRegister: true,     // true=register, false=forgot
  isLoading: false,         // optional spinner flag
  lastResponse: {},         // server response (no secrets)
};

export const registerEmailSlice = createSlice({
  name: 'registerEmail',
  initialState,
  reducers: {
    // Store *only* masked email in Redux
    setMaskedEmail(state, action) {
      state.maskedEmail = action.payload || '';
    },
    // Keep your existing flag semantics
    registerFlowFlag(state, action) {
      state.flowIsRegister = !!action.payload;
    },
    // Store server response object for UI (no PII)
    registerEmailResponseObj(state, action) {
      state.lastResponse = action.payload || {};
    },
    // Optional loading control
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
