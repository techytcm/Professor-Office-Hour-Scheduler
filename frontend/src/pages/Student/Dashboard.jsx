import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookings } from '../../hooks/useBookings.js'
import BookingCard from '../../components/Booking/BookingCard.jsx'
import { Calendar, Users, BookOpen, ArrowRight } from 'lucide-react'

const StudentDashboard = () => {
  const { bookings, loading, cancelBooking } = useBookings()
  const navigate = useNavigate()

  const upcomingBookings = bookings.filter(b => 
    new Date(b.start_time) > new Date() && b.status !== 'cancelled'
  ).slice(0, 3)

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: BookOpen, color: 'bg-blue-100 text-blue-700' },
    { label: 'Upcoming', value: upcomingBookings.length, icon: Calendar, color: 'bg-green-100 text-green-700' },
    { label: 'Professors', value: new Set(bookings.map(b => b.professor_id)).size, icon: Users, color: 'bg-purple-100 text-purple-700' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your office hour appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Upcoming Bookings</h2>
          <button 
            onClick={() => navigate('/student/bookings')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : upcomingBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No upcoming bookings</p>
            <button 
              onClick={() => navigate('/student/professors')}
              className="btn-primary mt-4"
            >
              Book an Office Hour
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onCancel={cancelBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard