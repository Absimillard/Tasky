import { createSlice, combineSlices } from '@reduxjs/toolkit';
import briefSlice, { setContent, setAttached } from './briefSlice';
import participantsSlice, { setParticipants } from './participantsSlice';
import guestsSlice, { setGuests } from './guestsSlice';
import submitSlice, { addSubmit } from './submitSlice';
import callbacksSlice, { addCallback } from './callbacksSlice';

const initialState = {
  selectedProject: null,
  currentSelected: {
    brief: {},
    participants: [],
    guests: [],
    submit: [],
    callbacks: [],
  },
};

const selectedProjectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setSelected(state, action) {
      state.selectedProject = state.currentSelected = action.payload;
    },
    setCurrentSelected(state, action) {
      state.currentSelected = action.payload;
    },
    updateCurrentSelected(state, action) {
    },
  },
});
export const {
  setSelected,
  setCurrentSelected,
  updateCurrentSelected,
  updateField,
} = selectedProjectSlice.actions;

export const fetchProject = (data) => (dispatch) => {
  try {
    dispatch(setSelected(data));
  } catch (error) {
    console.log(error.message)
  }
  
};


export default selectedProjectSlice.reducer;
