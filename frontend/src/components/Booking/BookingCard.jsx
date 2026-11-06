import { formatDateTime, isSlotExpired } from '../../utils/dateUtils.js'
import { Calendar, Clock, User, MapPin, Trash2 } from 'lucide-react'

const BookingCard = ({ booking, onCancel, userRole = 'student' }) => {
  const isExpired = isSlotExpired(booking.start_time)
  const canCancel = Boolean(onCancel) && !isExpired && booking.status !== 'cancelled'

  return (
    <div className={`card ${booking.status === 'cancelled' ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={18} />
            <span className="text-sm">{formatDateTime(booking.start_time)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={18} />
            <span className="text-sm">{booking.duration_minutes || 30} minutes</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <User size={18} />
            <span className="text-sm">
              {userRole === 'student' 
                ? `Prof. ${booking.professor_name}` 
                : `${booking.student_name || 'Student'}`}
            </span>
          </div>
          
          {booking.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} />
              <span className="text-sm">{booking.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            booking.status === 'confirmed' 
              ? 'bg-green-100 text-green-700'
              : booking.status === 'cancelled'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {booking.status || 'confirmed'}
          </span>
          
          {canCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              <Trash2 size={16} />
              Cancel
            </button>
          )}
        </div>
      </div>
      
      {booking.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {booking.notes}
          </p>
        </div>
      )}
    </div>
  )
}

export default BookingCard