import { TUser } from '@/zod-schemas/apiSchemas';
import { createSlice } from '@reduxjs/toolkit';

type TReduxUserState = {
  currentUser: TUser | null;
  error: null | Error;
  loading: boolean;
};

const initialState: TReduxUserState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserSuccess,
  deleteUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;
