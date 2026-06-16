import { useState, useEffect, useCallback } from 'react'
import { bookingService } from '../services/bookingService.js'

export const useBookings = () => {   // ← must be `useBookings` (not `useBooking`)
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
      setError(err.response?.data?.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  const createBooking = useCallback(async (slotId) => {
    try {
      const response = await bookingService.createBooking(slotId)
      setBookings(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create booking')
    }
  }, [])

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId)
      setBookings(prev => prev.filter(b => b.id !== bookingId))
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to cancel booking')
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