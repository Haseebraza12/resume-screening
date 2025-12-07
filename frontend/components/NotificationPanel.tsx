'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Check, CheckCheck, Trash2, AlertCircle, CheckCircle, Info, Briefcase, FileText } from 'lucide-react'
import { notificationsApi, Notification } from '@/lib/api'
import { useRouter } from 'next/navigation'

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchUnreadCount()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, showUnreadOnly])

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsApi.getUnreadCount()
      setUnreadCount(response.data.unread_count)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationsApi.getNotifications(showUnreadOnly)
      setNotifications(response.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      try {
        await notificationsApi.markAsRead([notification.id])
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }

    // Navigate to link if exists
    if (notification.link) {
      router.push(notification.link)
      setIsOpen(false)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleDeleteNotification = async (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await notificationsApi.deleteNotification(notificationId)
      const notification = notifications.find(n => n.id === notificationId)
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'job':
        return <Briefcase className="w-5 h-5 text-blue-500" />
      case 'resume':
        return <FileText className="w-5 h-5 text-purple-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-text-tertiary hover:text-text-primary transition-colors relative"
      >
        <Bell className="w-6 h-6 mt-2 stroke-[1.5]" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-status-error rounded-full border-2 border-secondary-bg"></span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 max-h-[32rem] bg-primary-bg rounded-3xl shadow-2xl border border-border/30 z-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-text-secondary">
                    {unreadCount} unread
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="p-2 hover:bg-secondary-bg rounded-xl transition-colors text-text-secondary hover:text-text-primary"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-secondary-bg rounded-xl transition-colors text-text-secondary hover:text-text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter */}
            <div className="px-4 py-2 border-b border-border/30">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowUnreadOnly(false)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${!showUnreadOnly
                    ? 'bg-primary text-white'
                    : 'bg-secondary-bg text-text-secondary hover:text-text-primary'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setShowUnreadOnly(true)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${showUnreadOnly
                    ? 'bg-primary text-white'
                    : 'bg-secondary-bg text-text-secondary hover:text-text-primary'
                    }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-text-tertiary">
                  <Bell className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">
                    {showUnreadOnly ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-secondary-bg/50 cursor-pointer transition-colors group ${!notification.is_read ? 'bg-primary/5' : ''
                        }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm ${!notification.is_read ? 'font-bold text-text-primary' : 'font-medium text-text-secondary'}`}>
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-text-tertiary">
                              {getTimeAgo(notification.created_at)}
                            </span>
                            <button
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                              className="p-1 hover:bg-secondary-bg rounded transition-colors opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-status-error"
                              title="Delete notification"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
