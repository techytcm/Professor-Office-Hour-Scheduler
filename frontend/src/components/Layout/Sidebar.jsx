import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Users, 
  Clock,
  List
} from 'lucide-react'

const Sidebar = () => {
  const { isProfessor } = useAuth()
  const location = useLocation()

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/professors', icon: Users, label: 'Professors' },
    { to: '/student/bookings', icon: BookOpen, label: 'My Bookings' },
  ]

  const professorLinks = [
    { to: '/professor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/professor/slots', icon: Clock, label: 'Manage Slots' },
    { to: '/professor/bookings', icon: List, label: 'Student Bookings' },
  ]

  const links = isProfessor() ? professorLinks : studentLinks

  return (
    <aside className="fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to
            const Icon = link.icon
            
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar