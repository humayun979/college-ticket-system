import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import AdminDashboard from './pages/AdminDashboard'
import StudentPortal from './pages/StudentPortal'
import Login from './pages/Login'
import { format } from 'date-fns'

const App = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    setNotifications([])
  }

  const addNotification = (title, message) => {
    const notification = {
      title,
      message,
      timestamp: format(new Date(), 'MMM dd, HH:mm'),
    }
    setNotifications([notification, ...notifications])
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10">
      {user && <Navigation user={user} onLogout={handleLogout} notifications={notifications} onClearNotifications={clearNotifications} />}
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />}
        />
        <Route
          path="/admin"
          element={user && user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/student"
          element={user && user.role === 'student' ? <StudentPortal user={user} onAddNotification={addNotification} /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'} />}
        />
      </Routes>
    </div>
  )
}

export default App