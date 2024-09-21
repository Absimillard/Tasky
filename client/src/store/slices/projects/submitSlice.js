// submitsSlice.js

import { createSlice, createAction } from '@reduxjs/toolkit';
import { addCallback, removeCallback, updateCallback } from './callbacksSlice';

const initialState = {
  submits: [],
};

export const addSubmit = createAction('submits/addSubmit');
export const removeSubmit = createAction('submits/removeSubmit');
export const updateSubmit = createAction('submits/updateSubmit');

const submitSlice = createSlice({
  name: 'submit',
  initialState,
  reducers: {
    addSubmit: (state, action) => {
        state.submits.push({
          ...action.payload,
          callbacks: [],
        });
      },
      removeSubmit: (state, action) => {
        state.submits = state.submits.filter(
          (submit) => submit.userID !== action.payload
        );
      },
     updateSubmit: (state, action) => {
        const index = state.submits.findIndex(
          (submit) => submit.userID === action.payload.userID
        );
        if (index !== -1) {
          state.submits[index] = {
            ...state.submits[index],
            ...action.payload.updatedFields,
          };
        }
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCallback, (state, action) => {
        const submitIndex = state.submits.findIndex(
          (submit) => submit.userID === action.payload.submitID
        );
        if (submitIndex !== -1) {
          state.submits[submitIndex].callbacks.push(action.payload.callback);
        }
      });
  },
});

export default submitSlice.reducer;
