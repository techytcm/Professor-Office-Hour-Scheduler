import api from './api.js'

export const bookingService = {
  getMyBookings: () => api.get('/bookings/my'),
  createBooking: (slotId, notes) => api.post('/bookings', { slot_id: slotId, notes: notes || null }),
  cancelBooking: (bookingId) => api.delete(`/bookings/${bookingId}`)
}
