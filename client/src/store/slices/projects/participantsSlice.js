import { createSlice, createAction } from '@reduxjs/toolkit';
export const addParticipant = createAction('participants/addParticipant');
export const removeParticipant = createAction('participants/removeParticipant');
export const updateParticipant = createAction('participants/updateParticipant');



const initialState = {
  participants: [],
};

const participantsSlice = createSlice({
  name: 'participants',
  initialState,
  reducers: {
      setParticipants(state, action) {
        state.participants = action.payload;
    },
  },
});

export const {
  setParticipants,
} = participantsSlice.actions;


export const updateParticipants = (data) => (dispatch) => {
  try {
    console.log(data)
    dispatch(setParticipants(data));
  } catch (error) {
    
  }
};

export default participantsSlice.reducer;
