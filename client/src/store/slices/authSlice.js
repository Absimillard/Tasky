// authSlice.js
import { createSlice } from '@reduxjs/toolkit';


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
    },
    logout: (state, action) => {
      state.user = null;
      state.token = null;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.loggedIn = false;
    },
    checkAuthSuccess: (state, action) => {
      console.log(action.payload)
      state.loggedIn = true;
      state.loading = false;
      state.user = action.payload;
    },
    checkAuthFailure: (state) => {
      state.loggedIn = false;
      state.loading = false;
      state.user = null;
    },
  },
});

export const { 
  setCredentials, 
  logout, 
  loginFailure, 
  checkAuthSuccess, 
  checkAuthFailure 
} = authSlice.actions;

export default authSlice.reducer;

export const currentUser = (state) => state.auth.user
export const currentToken = (state) => state.auth.token
