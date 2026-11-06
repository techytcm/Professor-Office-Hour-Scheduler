import { useState, useEffect, useCallback } from 'react'
import { bookingService } from '../services/bookingService.js'
import { getErrorMessage } from '../services/api.js'

export const useBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMyBookings = useCallback(async () => {
    setLoading(true)
    try {
      const response = await bookingService.getMyBookings()
      setBookings(response.data)
      setError(null)
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to fetch bookings'))
    } finally {
      setLoading(false)
    }
  }, [])

  const createBooking = useCallback(async (slotId, notes) => {
    try {
      const response = await bookingService.createBooking(slotId, notes)
      setBookings(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Failed to create booking'))
    }
  }, [])

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId)
      // Keep it in the list so it shows under the "Cancelled" tab
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Failed to cancel booking'))
    }
  }, [])

  useEffect(() => {
    fetchMyBookings()
  }, [fetchMyBookings])

  return {
    bookings,
    loading,
    error,
    fetchMyBookings,
    createBooking,
    cancelBooking
  }
}