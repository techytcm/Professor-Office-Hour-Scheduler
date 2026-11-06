import { useState, useEffect } from 'react'
import { professorService } from '../../services/professorService.js'
import { bookingService } from '../../services/bookingService.js'
import { getErrorMessage } from '../../services/api.js'
import BookingCard from '../../components/Booking/BookingCard.jsx'
import { Users } from 'lucide-react'

const StudentBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

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

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this student's booking?")) return
    try {
      await bookingService.cancelBooking(bookingId)
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    } catch (err) {
      window.alert(getErrorMessage(err, 'Failed to cancel booking'))
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const isUpcoming = new Date(booking.start_time) > new Date()
    const isCancelled = booking.status === 'cancelled'
    
    switch (filter) {
      case 'upcoming': return isUpcoming && !isCancelled
      case 'past': return !isUpcoming && !isCancelled
      case 'cancelled': return isCancelled
      default: return true
    }
  })

  const tabs = [
    { id: 'all', label: 'All', count: bookings.length },
    { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => new Date(b.start_time) > new Date() && b.status !== 'cancelled').length },
    { id: 'past', label: 'Past', count: bookings.filter(b => new Date(b.start_time) <= new Date() && b.status !== 'cancelled').length },
    { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Bookings</h1>
        <p className="text-gray-600 mt-1">View all appointments made by students</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="card text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No bookings found for this filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              userRole="professor"
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentBookings
