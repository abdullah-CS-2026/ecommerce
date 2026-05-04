import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { Check, X, AlertCircle } from 'lucide-react';

const Notification = () => {
  const { notification } = useContext(WishlistContext);

  if (!notification.show) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[notification.type];

  const icon = {
    success: <Check size={20} />,
    error: <X size={20} />,
    info: <AlertCircle size={20} />,
  }[notification.type];

  return (
    <div className={`fixed top-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-in slide-in-from-top-2 z-50`}>
      {icon}
      <span className="font-semibold">{notification.message}</span>
    </div>
  );
};

export default Notification;
