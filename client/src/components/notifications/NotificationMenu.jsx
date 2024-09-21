import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NotificationItem from './NotificationItem';
import { socketClient as socket } from '../../store/store';
import { fetchNotifications } from '../../store/slices/notifsSlice';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined"
import { Badge, Box, IconButton, Menu, MenuItem } from "@mui/material"

const NotificationMenu = () => {
  
  const { unread } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);
  const { isConnected } = useSelector((state) => state.socket);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const badges = unread?.length;
      
  const handleIncomingNotification = () => {
    // Fetch notifications when incoming notification is received
    if (user?.id) {
      console.log('Incoming notif !');
      dispatch(fetchNotifications(user?.id));
    }
  };
  
  useEffect(() => {
  
    // Check if the socket connection exists before setting up the listener
    if (isConnected) {
      socket.on('incomingNotification', handleIncomingNotification);
    }
  
    // Clean up the listener when component unmounts
    return () => {
      socket.off('incomingNotification', handleIncomingNotification);
    };
  }, [isConnected, dispatch, user]);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  return (<>
    <IconButton onClick={handleOpenMenu}>
    <Badge badgeContent={badges} color="secondary">
      <NotificationsOutlinedIcon />
    </Badge>
  </IconButton>
  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onBlur={handleCloseMenu}>
    {unread?.map((notification) => (
      <NotificationItem
        key={notification._id}
        notification={notification}
      />
    ))}
    {unread?.length === 0 && (
      <MenuItem onClick={handleCloseMenu}>No new notifications</MenuItem>
    )}
  </Menu>
  </>);
};

export default NotificationMenu;