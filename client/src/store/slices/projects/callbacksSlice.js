// callbacksSlice.js
import { createSlice, createAction } from '@reduxjs/toolkit';

const initialState = {
  callbacks: [],
};

export const addCallback = createAction('callbacks/addCallback');
export const removeCallback = createAction('callbacks/removeCallback');
export const updateCallback = createAction('callbacks/updateCallback');

const callbacksSlice = createSlice({
  name: 'callbacks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCallback, (state, action) => {
        state.callbacks.push(action.payload);
      })
      .addCase(removeCallback, (state, action) => {
        state.callbacks = state.callbacks.filter(
          (callback) => callback.userID !== action.payload
        );
      })
      .addCase(updateCallback, (state, action) => {
        const index = state.callbacks.findIndex(
          (callback) => callback.userID === action.payload.userID
        );
        if (index !== -1) {
          state.callbacks[index] = {
            ...state.callbacks[index],
            ...action.payload.updatedFields,
          };
        }
      });
  },
});

export default callbacksSlice.reducer;
