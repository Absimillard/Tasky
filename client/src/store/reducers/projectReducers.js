import { combineReducers } from 'redux';
import projectsListReducer from '../slices/projects/listSlice';
import selectedProjectReducer from '../slices/projects/selectedSlice';
import participantsReducer from '../slices/projects/participantsSlice';
import guestsReducer from '../slices/projects/guestsSlice';
import briefReducer from '../slices/projects/briefSlice';
import submitsReducer from '../slices/projects/submitSlice';

const projectsReducer = combineReducers({
  list: projectsListReducer,
  selected: selectedProjectReducer,
  participants: participantsReducer,
  guests: guestsReducer,
  brief: briefReducer,
  submits: submitsReducer,
});

export default projectsReducer;