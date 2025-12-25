import React from 'react'
import { useNotification } from '../../Context/NotificationContext'
import './Notification.css'

const Notification = () => {
  const { notifications } = useNotification()

  return (
    <div className="notification-container">
      {notifications.map((notif) => (
        <div key={notif.id} className="notification-toast">
          {notif.message}
        </div>
      ))}
    </div>
  )
}

export default Notification
