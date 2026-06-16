import { format, parseISO, isPast, isToday, isTomorrow, addMinutes } from 'date-fns'

export const formatDate = (dateString, pattern = 'MMM d, yyyy') => {
  return format(parseISO(dateString), pattern)
}

export const formatTime = (dateString, pattern = 'h:mm a') => {
  return format(parseISO(dateString), pattern)
}

export const formatDateTime = (dateString) => {
  return format(parseISO(dateString), 'MMM d, yyyy h:mm a')
}

export const getSlotEndTime = (startTime, durationMinutes = 30) => {
  return addMinutes(parseISO(startTime), durationMinutes)
}

export const getRelativeDateLabel = (dateString) => {
  const date = parseISO(dateString)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEEE, MMM d')
}

export const isSlotExpired = (dateString) => {
  return isPast(parseISO(dateString))
}

export const groupSlotsByDate = (slots) => {
  return slots.reduce((acc, slot) => {
    const date = format(parseISO(slot.start_time), 'yyyy-MM-dd')
    if (!acc[date]) acc[date] = []
    acc[date].push(slot)
    return acc
  }, {})
}
