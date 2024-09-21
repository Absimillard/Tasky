import { createSlice } from '@reduxjs/toolkit';
import { projectsApi } from '../api/apiSlice';

const initialState = {
  currents: [],
  loading: false,
  error: null,
};

const projectsListSlice = createSlice({
  name: 'projectsList',
  initialState,
  reducers: {
      setCurrents(state, action) {
      state.currents = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return action.type.startsWith(`${projectsApi.reducerPath}/fetchProjects`);
      },
      (state, action) => {
        if (action.type.endsWith('/fulfilled')) {
          console.log(action.payload)
          state.currents = action.payload; // Update the projects state with the fetched data
          state.loading = false; // Set the status to 'succeeded'
        } else if (action.type.endsWith('/pending')) {
          state.loading = ture;
        } else if (action.type.endsWith('/rejected')) {
          state.loading = false;
          state.error = action.error.message;
        }
      }
    )
  },
});

export const {
  setCurrents,
} = projectsListSlice.actions;


export const fetchProjects = (data) => (dispatch, getState) => {
  try {
    dispatch(setCurrents(data));
  } catch (error) {
    console.log(error.message)
  }
};

export default projectsListSlice.reducer;
