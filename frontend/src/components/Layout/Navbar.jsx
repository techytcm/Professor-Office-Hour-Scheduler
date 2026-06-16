import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { GraduationCap, LogOut, User } from 'lucide-react'

const Navbar = () => {
  const { user, logout, isProfessor } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 fixed w-full top-0 z-50">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-700 font-bold text-xl">
          <GraduationCap size={28} />
          <span>Office Hours</span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <User size={20} />
              <span className="font-medium">{user.name}</span>
              <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full font-medium">
                {isProfessor() ? 'Professor' : 'Student'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar