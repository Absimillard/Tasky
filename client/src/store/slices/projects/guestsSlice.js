import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teamGuests: [],
};
const guestsSlice = createSlice({
  name: 'guests',
  initialState,
  reducers: {
      setGuests(state, action) {
        state.teamGuests = action.payload;
    },
  },
});

export const {
  setGuests,
} = guestsSlice.actions;

export const updateGuests = (data) => (dispatch, state) => {
  try {
    dispatch(setGuests(data));
    
  } catch (error) {
    console.log(error.message)
  }
};

export default guestsSlice.reducer;
