import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserDetails = createAsyncThunk(
    'user/fetchDetails',
    async ({ rejectWithValue }) => {
        try {
            const response = await apiClient.get('/user/details');
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isLoading: false,
        error: null
    },
    reducers: {
        clearUser: state => {
            state.user = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
