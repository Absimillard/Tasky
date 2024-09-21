import React, { useState, useEffect } from 'react';
import NotificationMenu from './NotificationMenu';

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);
 
  return (
    <div>
      {notifications.map((notification, index) => (
        <NotificationMenu key={index} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;