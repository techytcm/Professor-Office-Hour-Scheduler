import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.js'
import Navbar from './components/Layout/Navbar.jsx'
import Sidebar from './components/Layout/Sidebar.jsx'
import Footer from './components/Layout/Footer.jsx'
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx'

// Auth Pages
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'

// Student Pages
import StudentDashboard from './pages/Student/Dashboard.jsx'
import ProfessorList from './pages/Student/ProfessorList.jsx'
import MyBookings from './pages/Student/MyBookings.jsx'
import BookOfficeHour from './pages/Student/BookOfficeHour.jsx'

// Professor Pages
import ProfessorDashboard from './pages/Professor/Dashboard.jsx'
import ManageSlots from './pages/Professor/ManageSlots.jsx'
import StudentBookings from './pages/Professor/StudentBookings.jsx'

function App() {
  const { user, loading } = useAuth()
  const homePath = user?.role === 'professor' ? '/professor/dashboard' : '/student/dashboard'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-[73px]">
        {user && <Sidebar />}
        <main className={`flex-1 p-6 ${user ? 'ml-64' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={user ? <Navigate to={homePath} replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to={homePath} replace /> : <Register />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/professors" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProfessorList />
              </ProtectedRoute>
            } />
            <Route path="/student/book/:professorId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <BookOfficeHour />
              </ProtectedRoute>
            } />
            <Route path="/student/bookings" element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyBookings />
              </ProtectedRoute>
            } />
            
            {/* Professor Routes */}
            <Route path="/professor/dashboard" element={
              <ProtectedRoute allowedRoles={['professor']}>
                <ProfessorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/professor/slots" element={
              <ProtectedRoute allowedRoles={['professor']}>
                <ManageSlots />
              </ProtectedRoute>
            } />
            <Route path="/professor/bookings" element={
              <ProtectedRoute allowedRoles={['professor']}>
                <StudentBookings />
              </ProtectedRoute>
            } />
            
            {/* Default Redirect */}
            <Route path="/" element={
              loading ? null : <Navigate to={user ? homePath : '/login'} replace />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App