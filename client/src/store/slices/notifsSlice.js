import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  selectedNotification: null,
  unread:[],
  currents: []
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    getNotifications(state, action) {
      state.currents = action.payload;
    },
    setUnreadNotification(state, action) {
      state.unread = action.payload;
    },
    setSelectedNotification(state, action) {
      state.selectedNotification = action.payload;
    },
    updateNotificationStatus(state, action) {
      const notificationId = action.payload;
      return {
        ...state,
        currents: state.currents.map(notification =>
          notification._id === notificationId ? { ...notification, read: { status: true } } : notification
        ),
        unread: state.unread.filter(notification => notification._id !== notificationId)
      };
    },
    updateAllNotificationsStatus(state) {
      state.currents = state.currents.map(notification => ({
        ...notification,
        read: { status: true }
      }));
      state.unread = [];
    },
    deleteNotificationSuccess(state, action) {
      state.currents = state.currents.filter((notification) => notification._id !== action.payload);
      state.selectedNotification = null;
    },
  },
});

export const {
  getNotifications,
  getNotificationsFailure,
  setSelectedNotification,
  setUnreadNotification,
  updateNotificationStatus,
  updateAllNotificationsStatus,
  deleteNotificationSuccess,
} = notificationsSlice.actions;

export const fetchNotifications = (data) => async (dispatch) => {
  try {
    const unreadNotifications = data?.notifications.filter(notification => !notification.read.status);
    dispatch(getNotifications(data?.notifications));
    dispatch(setUnreadNotification(unreadNotifications));
  } catch (error) {
    console.log(error.message)
  }
};
export const fetchNotificationById = (notificationId) => async (dispatch) => {
  try {
    dispatch(getNotificationsStart());
    const response = await axios.get(`/notifications/${notificationId}`);
    dispatch(setSelectedNotification(response.data.notification)); // Assuming response.data contains notification data
  } catch (error) {
    dispatch(getNotificationsFailure(error.message));
  }
};

export const markAsRead = (notificationId) => async (dispatch, getState) => {
  try {
    const { unread } = getState().notifications;
    const notificationToUpdate = unread.find(notification => notification._id === notificationId);

    if (!notificationToUpdate) {
      throw new Error('Notification not found');
    }
    // Update the notification status on the server
    // Dispatch action to update the notification status in the store
    dispatch(updateNotificationStatus(notificationId));
  } catch (error) {
    console.error(error);
  }
};

export const markAllAsRead = (userId) => async (dispatch, getState) => {
  try {
    const { unread } = getState().notifications;
    if (unread.length > 0) {
      // Update the status of all unread notifications on the server
       // Construct an array of objects containing the ID and the new read status
       const updates = unread.map(notification => ({
        id: notification._id,
        read: { status: true }
      }));
      // Make a single request to update the statuses of all unread notifications
      await axios.put(`/notifications/${userId}`, updates);
      // Dispatch action to mark all unread notifications as read in the store
      dispatch(updateAllNotificationsStatus());
    }
  } catch (error) {
    // Handle error
  }
};

export const deleteNotification = (userId, notificationId) => async (dispatch) => {
  try {
    await axios.delete(`/notifications/${userId}/${notificationId}`);
    dispatch(deleteNotificationSuccess(notificationId));
  } catch (error) {
    // Handle error
  }
};

export default notificationsSlice.reducer;
