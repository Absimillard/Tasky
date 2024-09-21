import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { authApi, usersApi, projectsApi, notifsApi } from './slices/api/apiSlice'; // Import your API slices
import socketMiddleware from './middleware/socketMiddleware';
import SocketClient from './middleware/socketClient';
import usersReducer from './slices/usersSlice';
import projectsReducer from './reducers/projectReducers';
import notificationsReducer from './slices/notifsSlice';
import authReducer from './slices/authSlice';
import socketReducer from './slices/socketSlice'; 
// Create an instance of SocketClient
const socketClient = new SocketClient('http://localhost:3000');
const rootReducer = combineReducers({
  auth: authReducer, 
  socket: socketReducer,
  users: usersReducer,
  projects: projectsReducer,
  notifications: notificationsReducer,
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [projectsApi.reducerPath]: projectsApi.reducer,
  [notifsApi.reducerPath]: notifsApi.reducer,
});
// Apply the custom middleware
const webSocketMiddleware = socketMiddleware(socketClient);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, usersApi.middleware, projectsApi.middleware, notifsApi.middleware, [webSocketMiddleware]),
  devTools: true
});

setupListeners(store.dispatch);

export { store, socketClient };
