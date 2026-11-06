import { useState } from 'react'
import { useOfficeHours } from '../../hooks/useOfficeHours.js'
import OfficeHourForm from '../../components/Professor/OfficeHourForm.jsx'
import { formatDate, formatTime } from '../../utils/dateUtils.js'
import { Plus, Trash2, Calendar, Clock } from 'lucide-react'

const ManageSlots = () => {
  const { slots, loading, createSlot, deleteSlot } = useOfficeHours()
  const [showForm, setShowForm] = useState(false)

  const handleCreateSlot = async (data) => {
    await createSlot(data)
    setShowForm(false)
  }

  const handleDelete = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this slot? Any bookings for it will be removed.')) {
      try {
        await deleteSlot(slotId)
      } catch (err) {
        window.alert(err.message)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Office Hours</h1>
          <p className="text-gray-600 mt-1">Create and manage your availability slots</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          {showForm ? 'Hide Form' : 'New Slot'}
        </button>
      </div>

      {showForm && <OfficeHourForm onSubmit={handleCreateSlot} />}

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Time Slots</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No office hour slots created yet</p>
            <p className="text-sm mt-1">Click "New Slot" to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Bookings</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...slots].sort((a, b) => new Date(a.start_time) - new Date(b.start_time)).map(slot => (
                  <tr key={slot.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm">{formatDate(slot.start_time)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-sm">
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{slot.location}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        slot.is_booked 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {slot.is_booked ? 'Full' : 'Available'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {slot.current_bookings || 0} / {slot.max_students || 1}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(slot.id)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete slot"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageSlots