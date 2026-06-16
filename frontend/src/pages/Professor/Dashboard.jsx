import { useOfficeHours } from '../../hooks/useOfficeHours.js'
import { professorService } from '../../services/professorService.js'
import { useState, useEffect } from 'react'
import AvailabilityCalendar from '../../components/Professor/AvailabilityCalendar.jsx'
import BookingCard from '../../components/Booking/BookingCard.jsx'
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react'

const ProfessorDashboard = () => {
  const { slots } = useOfficeHours()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await professorService.getMyBookings()
        setBookings(response.data)
      } catch (err) {
        console.error('Failed to fetch bookings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const todayBookings = bookings.filter(b => {
    const bookingDate = new Date(b.start_time)
    const today = new Date()
    return bookingDate.toDateString() === today.toDateString() && b.status !== 'cancelled'
  })

  const stats = [
    { label: 'Total Slots', value: slots.length, icon: Calendar, color: 'bg-blue-100 text-blue-700' },
    { label: "Today's Bookings", value: todayBookings.length, icon: Users, color: 'bg-green-100 text-green-700' },
    { label: 'Available Slots', value: slots.filter(s => !s.is_booked).length, icon: Clock, color: 'bg-purple-100 text-purple-700' },
    { label: 'Booking Rate', value: slots.length > 0 ? Math.round((slots.filter(s => s.is_booked).length / slots.length) * 100) + '%' : '0%', icon: TrendingUp, color: 'bg-orange-100 text-orange-700' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Professor Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your office hours and student bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AvailabilityCalendar slots={slots} />

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={20} className="text-primary-600" />
            Today's Bookings
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : todayBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No bookings scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayBookings.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  userRole="professor"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfessorDashboard