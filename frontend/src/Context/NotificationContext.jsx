import React, { createContext, useContext, useState } from 'react'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const showNotification = (message, duration = 2000) => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message }])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    }, duration)
  }

  return (
    <NotificationContext.Provider value={{ showNotification, notifications }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}

export default NotificationContext
