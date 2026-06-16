import { formatTime, getRelativeDateLabel, groupSlotsByDate } from '../../utils/dateUtils.js'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

const TimeSlotGrid = ({ slots, onBook, userRole = 'student' }) => {
  const groupedSlots = groupSlotsByDate(slots)

  if (slots.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Clock size={48} className="mx-auto mb-4 text-gray-300" />
        <p>No available time slots</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedSlots).map(([date, dateSlots]) => (
        <div key={date} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
              {getRelativeDateLabel(dateSlots[0].start_time)}
            </span>
            <span className="text-gray-400 font-normal text-sm">
              {date}
            </span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {dateSlots.map((slot) => {
              const isBooked = slot.is_booked
              const isExpired = new Date(slot.start_time) < new Date()
              
              return (
                <button
                  key={slot.id}
                  onClick={() => !isBooked && !isExpired && onBook(slot)}
                  disabled={isBooked || isExpired}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                    isBooked
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                      : isExpired
                      ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50'
                      : 'bg-white border-primary-200 hover:border-primary-500 hover:shadow-md cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">
                      {formatTime(slot.start_time)}
                    </span>
                    {isBooked && <CheckCircle size={18} className="text-green-500" />}
                    {isExpired && <XCircle size={18} className="text-gray-400" />}
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {slot.duration_minutes || 30} min
                  </p>
                  
                  {isBooked && (
                    <span className="absolute top-2 right-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      Booked
                    </span>
                  )}
                  
                  {isExpired && (
                    <span className="absolute top-2 right-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      Past
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TimeSlotGrid