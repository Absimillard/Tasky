import { createSlice } from '@reduxjs/toolkit';
import { projectsApi } from './api/apiSlice'; // Import the projectsApi

const initialState = {
  selectedProject: null,
  currentSelected: null,
  currents: null,
  loading: false,
  error: null,
};
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
      setCurrents(state, action) {
      state.currents = action.payload;
    },
  }, // Empty since all reducers are moved to extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(projectsApi.endpoints.fetchProjects.fulfilled, (state, action) => {
        console.log(action)
        state.selectedProject = action.payload;
        state.currentSelected = action.payload;
      })
      .addCase(projectsApi.endpoints.fetchProject.fulfilled, (state, action) => {
        state.selectedProject = action.payload;
        state.currentSelected = action.payload;
      })
      .addCase(projectsApi.endpoints.createProject.fulfilled, (state, action) => {
        state.currents.push(action.payload);
      })
      .addCase(projectsApi.endpoints.updateProject.fulfilled, (state, action) => {
        const { _id, ...updatedFields } = action.payload;
        state.currents = state.currents.map((project) =>
          project._id === _id ? { ...project, ...updatedFields } : project
        );
        state.currentSelected = { ...state.currentSelected, ...updatedFields };
      })
      .addCase(projectsApi.endpoints.deleteProject.fulfilled, (state, action) => {
        state.currents = state.currents.filter((project) => project._id !== action.payload);
        state.selectedProject = null;
        state.currentSelected = null;
      });
  },
});

export const {
  setCurrents,
  setSelectedProject,
  setCurrentSelected,
  setCurrentBrief,
  updateProjectSuccess,
  createProjectSuccess,
  deleteProjectSuccess,
} = projectsSlice.actions;


export default projectsSlice.reducer;
