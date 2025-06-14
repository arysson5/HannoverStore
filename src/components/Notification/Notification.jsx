import React from 'react';
import { useApp } from '../../context/AppContext';
import './Notification.css';

const Notification = () => {
  const { notification } = useApp();

  if (!notification) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`notification notification-${notification.type}`}>
      <div className="notification-content">
        <span className="notification-icon">
          {getIcon(notification.type)}
        </span>
        <span className="notification-message">
          {notification.message}
        </span>
      </div>
    </div>
  );
};

export default Notification; 