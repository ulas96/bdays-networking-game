import React from 'react';

const NotificationContainer = ({ notifications }) => (
  <div id="notification-container">
    {notifications && notifications.map((note, i) => (
      <div key={i} className="notification-item">{note}</div>
    ))}
  </div>
);

export default NotificationContainer;
