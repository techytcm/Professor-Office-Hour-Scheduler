import { Routes, Route } from 'react-router-dom'
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

// Professor Pages
import ProfessorDashboard from './pages/Professor/Dashboard.jsx'
import ManageSlots from './pages/Professor/ManageSlots.jsx'
import StudentBookings from './pages/Professor/StudentBookings.jsx'

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className={`flex-1 p-6 ${user ? 'ml-64' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
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
              user ? (
                user.role === 'professor' ? 
                  <ProfessorDashboard /> : <StudentDashboard />
              ) : <Login />
            } />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App