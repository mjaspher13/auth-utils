import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api'; // Make sure to define your apiClient elsewhere
import { userIdentityStorage } from '../storage/storageHelpers'; // Path to your storage helpers

// Async thunk for logging in the user
export const userLogin = createAsyncThunk(
  'user/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/user/login', {
        username,
        password,
        grant_type: 'password',
        touch_token: null,
      });
      // Assuming the token is in response.data.access_token
      return response.data.access_token;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching user details
export const fetchUserDetails = createAsyncThunk(
  'user/fetchDetails',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/user/details');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const loginSlice = createSlice({
  name: 'user',
  initialState: {
    isLoading: false,
    isLoggedIn: false,
    token: null,
    userDetails: null,
    error: null,
  },
  reducers: {
    // Standard reducers can go here
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.token = action.payload;
        // Save the token in storage
        userIdentityStorage.set('token', action.payload?.access_token);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.error = action.payload;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { actions, reducer } = loginSlice;
export default reducer;
