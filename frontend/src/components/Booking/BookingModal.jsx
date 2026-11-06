import { useState } from 'react'
import { formatDateTime } from '../../utils/dateUtils.js'
import { X, Calendar, Clock, AlertCircle } from 'lucide-react'

const BookingModal = ({ slot, professor, onConfirm, onClose }) => {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    setLoading(true)
    setError('')
    try {
      await onConfirm(slot.id, notes)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create booking')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Confirm Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="text-primary-600" size={20} />
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">{formatDateTime(slot.start_time)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="text-primary-600" size={20} />
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{slot.duration_minutes || 30} minutes · {slot.location}</p>
            </div>
          </div>

          {professor && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                {professor.name?.charAt(0) || 'P'}
              </div>
              <div>
                <p className="text-sm text-gray-500">Professor</p>
                <p className="font-medium">{professor.name}</p>
                <p className="text-sm text-gray-500">{professor.department}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field h-24 resize-none"
            placeholder="What would you like to discuss?"
          />
        </div>

        <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
          <p className="text-sm text-blue-700">
            Please arrive on time. Cancel at least 2 hours in advance if you can't make it.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingModal