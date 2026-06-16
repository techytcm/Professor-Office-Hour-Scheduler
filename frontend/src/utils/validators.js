export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 8
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

export const validateTimeSlot = (startTime, endTime) => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  return start < end
}

export const validateFutureDate = (dateString) => {
  const date = new Date(dateString)
  return date > new Date()
}
