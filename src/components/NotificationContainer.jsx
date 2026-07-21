import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { X } from 'lucide-react';

function NotificationContainer() {
  const { notifications, removeNotification } = useContext(NotificationContext);

  const getNotificationStyles = (type) => {
    const baseStyles = 'border-2 border-black font-black uppercase tracking-wider text-sm';
    
    const typeStyles = {
      success: 'bg-green-400 text-dark-900 shadow-brutal-md',
      error: 'bg-accent-500 text-white shadow-brutal-md',
      info: 'bg-primary-500 text-white shadow-brutal-md',
      warning: 'bg-yellow-400 text-dark-900 shadow-brutal-md',
    };

    return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
  };

  return (
    <div className="fixed top-29 left-1/2 transform -translate-x-1/2 z-50 space-y-3 pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`${getNotificationStyles(notif.type)} px-6 py-4 flex items-center justify-between gap-4 min-w-max pointer-events-auto animate-pulse`}
        >
          <span>{notif.message}</span>
          <button
            onClick={() => removeNotification(notif.id)}
            className="hover:scale-110 transition-transform"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationContainer;
