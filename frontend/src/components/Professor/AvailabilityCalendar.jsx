import { useState } from 'react'
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'

const AvailabilityCalendar = ({ slots, onSelectDate }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getSlotsForDay = (day) => {
    return slots.filter(slot => isSameDay(parseISO(slot.start_time), day))
  }

  const handlePrevWeek = () => setCurrentWeek(prev => addDays(prev, -7))
  const handleNextWeek = () => setCurrentWeek(prev => addDays(prev, 7))

  const handleSelectDate = (day) => {
    setSelectedDate(day)
    onSelectDate?.(day)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Weekly Overview</h2>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-600">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </span>
          <button onClick={handleNextWeek} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const daySlots = getSlotsForDay(day)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isToday = isSameDay(day, new Date())

          return (
            <button
              key={index}
              onClick={() => handleSelectDate(day)}
              className={`p-3 rounded-lg text-center transition-all ${
                isSelected 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : isToday
                  ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <p className="text-xs font-medium mb-1">{format(day, 'EEE')}</p>
              <p className="text-lg font-bold">{format(day, 'd')}</p>
              {daySlots.length > 0 && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Clock size={12} />
                  <span className="text-xs">{daySlots.length}</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Slots for {format(selectedDate, 'EEEE, MMM d')}
          </h3>
          {getSlotsForDay(selectedDate).length === 0 ? (
            <p className="text-sm text-gray-500">No slots scheduled</p>
          ) : (
            <div className="space-y-2">
              {getSlotsForDay(selectedDate).map(slot => (
                <div key={slot.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">
                    {format(parseISO(slot.start_time), 'h:mm a')} - {format(parseISO(slot.end_time), 'h:mm a')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    slot.is_booked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {slot.is_booked ? 'Booked' : 'Available'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AvailabilityCalendar