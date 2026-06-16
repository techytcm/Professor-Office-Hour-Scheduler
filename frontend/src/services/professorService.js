import api from './api.js'

export const professorService = {
  // Professor operations
  getMySlots: () => api.get('/professors/me/slots'),
  createSlot: (data) => api.post('/professors/me/slots', data),
  deleteSlot: (slotId) => api.delete(`/professors/me/slots/${slotId}`),
  getMyBookings: () => api.get('/professors/me/bookings'),
  
  // Student operations
  getAllProfessors: () => api.get('/professors'),
  getProfessorSlots: (professorId) => api.get(`/professors/${professorId}/slots`)
}