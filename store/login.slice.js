import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginStatusStorage, userIdentityStorage } from '../storage';

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
      return response.data.access_token;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userLogout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/user/logout');
    clearAllStorage();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const loginSlice = createSlice({
  name: 'user',
  initialState: {
    isLoading: false,
    isLoggedIn: false,
    token: null,
    error: null,
  },
  reducers: {

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
        loginStatusStorage.set(true);
        userIdentityStorage.set(action.payload?.access_token);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.error = action.payload;
      })
  },
});

export const { actions, reducer } = loginSlice;
export default reducer;
