import { Box, IconButton, MenuItem } from '@mui/material';
import React, { useEffect } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { markAsRead, markAllAsRead, deleteNotification } from '../../store/slices/notifsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMarkAsReadMutation } from '../../store/slices/api/apiSlice';

const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const notifId = notification?._id;
  
  const [triggerMutation, { isLoading, isError, data, isSuccess }] = useMarkAsReadMutation();
 
  const calculateTimestamp = (createdAt) => {
      const timeAgo = moment(createdAt).fromNow(); 
      return timeAgo;
  };
  const handleGoTo = (type, id) => {
    navigate(`/${type}/${id}`);
  }; 
  const handleMarkAsRead = async (e, userId) => {
    e.stopPropagation();
    console.log("Notification ID:", notifId); // Log the notifId for debugging
    const mutationResult = await triggerMutation({userId, notifId});
    console.log("Mutation Result:", mutationResult); // Log the result of the mutation for debugging
    dispatch(markAsRead(notifId));
  };
  const handleDismiss = (e, notifId) => {
    e.stopPropagation();
    dispatch(deleteNotification(notifId));
  };
  return (
      <MenuItem key={notification._id}>
        <Box display='flex' flexDirection='row' justifyContent='space-between' width='100%'>
          <Box onClick={() => handleGoTo(notification.object, notification.content.relatedId)}>
            {/* Notification Type */}
            <div>Type: {notification.type}</div>
            {/* Notification Content */}
            <div>
                {/*<div>Related ID: {notification.content.relatedID}</div> */}
                <div>Message: {notification.content.message}</div>
            </div>
          </Box>
          {/* Actions */}
          <Box display='flex' flexDirection='row' flexWrap='wrap' justifyContent='end' flex={0.5}>
            <IconButton onClick={(e) =>  handleMarkAsRead(e, user?._id)} variant="contained">
              <VisibilityOutlinedIcon />
            </IconButton>
              <IconButton onClick={(e) => handleDismiss(e, notification._id)} variant="contained">
            <CancelOutlinedIcon />
            </IconButton>
            {/* Timestamp */}
            <Box ml={3}>{calculateTimestamp(notification.createdAt)}</Box>
          </Box>
          </Box>
      </MenuItem>
  );
};

export default NotificationItem