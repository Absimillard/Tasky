// usersSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { useFetchUsersQuery } from './api/apiSlice';

export const fetchUsersData = createAsyncThunk(
  'sliceName/fetchUsersData', // Specify a unique name for this async action
  async () => {
    // Use the RTK Query API to fetch data
    const response = await useFetchUsersQuery();
    return response.data; // Assuming the API returns data
  }
);

const initialState = {
  selectedUser: null,
  currents: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsersStart(state) {
      state.loading = true;
    },
    getUsersSuccess(state, action) {
      state.loading = false;
      state.currents = action.payload;
    },
    getUsersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    createUserSuccess(state, action) {
      state.currents.push(action.payload);
    },
    updateUserSuccess(state, action) {
      state.currents = state.currents.map(user =>
        user._id === action.payload._id ? action.payload : user
      );
      state.selectedUser = action.payload;
    },
    deleteUserSuccess(state, action) {
      state.currents = state.currents.filter(user => user._id !== action.payload);
      state.selectedUser = null;
    },
  },
});

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  setSelectedUser,
  createUserSuccess,
  updateUserSuccess,
  deleteUserSuccess,
} = usersSlice.actions;

export const setUsers = (data) => async (dispatch) => {
  try {
    dispatch(getUsersSuccess(data));
    // Assuming response.data contains user data
  } catch (error) {
    dispatch(getUsersFailure(error.message));
  }
};

export const setUserById = (userId) => async (dispatch) => {
  try {
    dispatch(getUsersStart());
    const response = await axios.get(`/users/${userId}`);
    dispatch(setSelectedUser(response.data)); // Assuming response.data contains user data
  } catch (error) {
    dispatch(getUsersFailure(error.message));
  }
};

export const createUser = (userData, socket) => async (dispatch) => {
  try {
    const response = await axios.post('/users', userData);
    socket.emit('createdUser', response.data.user);
    dispatch(createUserSuccess(response.data)); // Assuming response.data contains the created user
  } catch (error) {
    // Handle error
  }
};

export const updateUser = (userId, updatedUserData) => async (dispatch) => {
  try {
    const response = await axios.put(`/users/${userId}`, updatedUserData);
    dispatch(updateUserSuccess(response.data)); // Assuming response.data contains the updated user
  } catch (error) {
    // Handle error
  }
};

export const deleteUser = (userId) => async (dispatch) => {
  try {
    await axios.delete(`/users/${userId}`);
    dispatch(deleteUserSuccess(userId));
  } catch (error) {
    // Handle error
  }
};

export default usersSlice.reducer;
