import api from './api.js'

export const bookingService = {
  getMyBookings: () => api.get('/bookings/my'),
  createBooking: (slotId) => api.post('/bookings', { slot_id: slotId }),
  cancelBooking: (bookingId) => api.delete(`/bookings/${bookingId}`),
  getBookingDetails: (bookingId) => api.get(`/bookings/${bookingId}`)
}