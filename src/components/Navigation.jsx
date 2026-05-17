import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Ticket, LogOut, User, LayoutDashboard, Bell, X } from 'lucide-react'
import { useState } from 'react'

const Navigation = ({ user, onLogout, notifications = [], onClearNotifications }) => {
  const location = useLocation()
  const isAdmin = user?.role === 'admin'
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="container-bordered">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to={isAdmin ? '/admin' : '/student'} className="flex items-center space-x-2">
              <Ticket className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-primary">UniTicket</span>
            </Link>

            <div className="hidden md:flex space-x-1">
              {isAdmin ? (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === '/admin'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-primary/10'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/student"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === '/student'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-primary/10'
                  }`}
                >
                  <Ticket className="w-5 h-5" />
                  <span className="font-medium">My Tickets</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            {!isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 text-gray-600 hover:bg-primary/10 rounded-lg transition-all duration-200"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0 right-0 flex items-center justify-center min-w-5 h-5 bg-danger text-white text-xs font-bold rounded-full"
                    >
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </motion.span>
                  )}
                </button>

                {isNotificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 flex items-center justify-between">
                      <h3 className="text-white font-semibold flex items-center space-x-2">
                        <Bell className="w-5 h-5" />
                        <span>Notifications</span>
                      </h3>
                      <button
                        onClick={() => setIsNotificationOpen(false)}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-6 py-8 text-center">
                          <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="px-6 py-4 hover:bg-gray-50 transition-colors"
                            >
                              <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2">{notification.timestamp}</p>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <button
                        onClick={() => {
                          onClearNotifications()
                          setIsNotificationOpen(false)
                        }}
                        className="w-full px-6 py-3 text-sm font-medium text-primary hover:bg-gray-50 transition-colors border-t border-gray-100"
                      >
                        Clear All
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-danger hover:bg-danger/10 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation