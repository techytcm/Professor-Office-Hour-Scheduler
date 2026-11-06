import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useOfficeHours } from '../../hooks/useOfficeHours.js'
import { bookingService } from '../../services/bookingService.js'
import { professorService } from '../../services/professorService.js'
import { getErrorMessage } from '../../services/api.js'
import TimeSlotGrid from '../../components/Booking/TimeSlotGrid.jsx'
import BookingModal from '../../components/Booking/BookingModal.jsx'
import { ArrowLeft, Building2, Mail } from 'lucide-react'

const BookOfficeHour = () => {
  const { professorId } = useParams()
  const navigate = useNavigate()
  const { slots, loading, error, fetchSlots } = useOfficeHours(professorId)
  const [professor, setProfessor] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)

  useEffect(() => {
    professorService.getAllProfessors()
      .then(res => setProfessor(res.data.find(p => String(p.id) === String(professorId)) || null))
      .catch(() => setProfessor(null))
  }, [professorId])

  const handleConfirm = async (slotId, notes) => {
    try {
      await bookingService.createBooking(slotId, notes)
    } catch (err) {
      // Slot list may be stale (e.g. someone else just booked it)
      fetchSlots()
      throw new Error(getErrorMessage(err, 'Failed to create booking'))
    }
    navigate('/student/bookings')
  }

  return (
    <div className="space-y-6">
      <Link to="/student/professors" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
        <ArrowLeft size={16} /> Back to professors
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {professor ? `Book with ${professor.name}` : 'Book an Office Hour'}
        </h1>
        {professor && (
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1"><Building2 size={14} />{professor.department || 'Department N/A'}</span>
            <span className="flex items-center gap-1"><Mail size={14} />{professor.email}</span>
          </div>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <p className="text-center py-12 text-red-600">{error}</p>
        ) : (
          <TimeSlotGrid slots={slots} onBook={setSelectedSlot} />
        )}
      </div>

      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          professor={professor}
          onConfirm={handleConfirm}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  )
}

export default BookOfficeHour
