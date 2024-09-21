import { createSlice } from '@reduxjs/toolkit';
import { socketClient } from '../store';
import { fetchNotifications } from '../slices/notifsSlice';

const initialState = {
  isConnected: false,
  messages: [],
  error: null,
};


export const connectToSocket = (id) => async (dispatch) => {
  try {
    await socketClient.connect(id);
    dispatch(connectionEstablished());
    dispatch(initSocketListeners(id));
  } catch (error) {
    dispatch(connectionFailed(error.message));
  }
};

export const disconnectFromSocket = () => async (dispatch) => {
  try {
    await socketClient.disconnect();
    dispatch(connectionLost());
  } catch (error) {
    console.error('Error disconnecting from socket:', error);
  }
};

export const initSocketListeners = (userId) => (dispatch) => {
  socketClient.on('incomingNotification', () => {
    // Fetch notifications when incoming notification is received
      console.log('Incoming notif !');
      dispatch(fetchNotifications(userId));
  });
  socketClient.on('validAuth', (userId) => {
    // Fetch notifications when incoming notification is received
      console.log('Authenticated socket connection with', userId);
  });
  // Add more listeners as needed
  // Example listener for handling errors
  socketClient.on('error', (error) => {
    console.error('Socket error:', error);
    dispatch(socketError(error.message));
  });
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connectionEstablished(state) {
      state.isConnected = true;
      state.error = null;
    },
    connectionFailed(state, action) {
      state.error = action.payload;
    },
    connectionLost(state) {
      state.isConnected = false;
    },
    socketError(state, action) {
      state.error = action.payload;
    },
    receiveMessage(state, action) {
      state.messages.push(action.payload);
    },
  },
});

export const { connectionEstablished, connectionLost, socketError, receiveMessage } = socketSlice.actions;

export default socketSlice.reducer;
