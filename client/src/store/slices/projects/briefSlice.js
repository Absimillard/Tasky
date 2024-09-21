import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsersData = createAsyncThunk(
  'sliceName/fetchUsersData', // Specify a unique name for this async action
  async () => {
    // Use the RTK Query API to fetch data
    const response = await fetchUsers();
    return response.data; // Assuming the API returns data
  }
);

const initialState = {
    attached: [],
    content: '',
};

const briefSlice = createSlice({
  name: 'brief',
  initialState,
  reducers:  {
    setContent(state, action) {
      state.content = action.payload;
    },
    setAttached(state, action) {
      state.attached = action.payload;
    },
  },
});

export const {
  setContent,
  setAttached
} = briefSlice.actions;

export default briefSlice.reducer;
