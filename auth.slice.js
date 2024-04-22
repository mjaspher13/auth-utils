// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';  // Import your axios instance

export const authenticateUser = createAsyncThunk(
  'auth/authenticateUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/login', { username, password });
      const { user, token } = response.data;
      localStorage.setItem('authToken', token);  // Save token to localStorage
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  status: 'idle',  // 'idle', 'loading', 'succeeded', 'failed'
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('authToken');  // Remove token from localStorage
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'succeeded';
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
