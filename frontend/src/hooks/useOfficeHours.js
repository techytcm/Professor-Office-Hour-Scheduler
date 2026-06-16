import { useState, useEffect, useCallback } from 'react'
import { professorService } from '../services/professorService.js'

export const useOfficeHours = (professorId = null) => {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSlots = useCallback(async () => {
    setLoading(true)
    try {
      const response = professorId 
        ? await professorService.getProfessorSlots(professorId)
        : await professorService.getMySlots()
      setSlots(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch slots')
    } finally {
      setLoading(false)
    }
  }, [professorId])

  const createSlot = useCallback(async (slotData) => {
    try {
      const response = await professorService.createSlot(slotData)
      setSlots(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create slot')
    }
  }, [])

  const deleteSlot = useCallback(async (slotId) => {
    try {
      await professorService.deleteSlot(slotId)
      setSlots(prev => prev.filter(s => s.id !== slotId))
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete slot')
    }
  }, [])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  return {
    slots,
    loading,
    error,
    fetchSlots,
    createSlot,
    deleteSlot
  }
}