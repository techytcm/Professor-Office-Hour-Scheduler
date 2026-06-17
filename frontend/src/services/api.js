import axios from 'axios'

// MOCK MODE: Set to false when you connect to real backend
const MOCK_MODE = false

// Create a mock API that simulates backend responses
const mockApi = {
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    
    if (url === '/auth/login' || url === '/auth/register') {
      return {
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            email: data.email || 'user@example.com',
            name: data.first_name ? `${data.first_name} ${data.last_name}` : 'Test User',
            role: data.role || 'student'
          }
        }
      }
    }
    
    if (url === '/bookings') {
      return {
        data: {
          id: Date.now(),
          status: 'confirmed',
          start_time: new Date().toISOString(),
          professor_name: 'Dr. Smith',
          professor_id: 1,
          student_name: 'Test User',
          duration_minutes: 30,
          location: 'Room 301'
        }
      }
    }
    
    throw new Error('Mock endpoint not implemented: ' + url)
  },
  
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (url === '/bookings/my') {
      return {
        data: [
          {
            id: 1,
            status: 'confirmed',
            start_time: new Date(Date.now() + 86400000).toISOString(),
            professor_name: 'Dr. Smith',
            professor_id: 1,
            student_name: 'Test User',
            duration_minutes: 30,
            location: 'Room 301',
            notes: 'Discuss project ideas'
          },
          {
            id: 2,
            status: 'confirmed',
            start_time: new Date(Date.now() + 172800000).toISOString(),
            professor_name: 'Dr. Johnson',
            professor_id: 2,
            student_name: 'Test User',
            duration_minutes: 30,
            location: 'Office 205',
            notes: ''
          }
        ]
      }
    }
    
    if (url === '/professors') {
      return {
        data: [
          {
            id: 1,
            name: 'Dr. Smith',
            email: 'smith@university.edu',
            department: 'Computer Science'
          },
          {
            id: 2,
            name: 'Dr. Johnson',
            email: 'johnson@university.edu',
            department: 'Mathematics'
          },
          {
            id: 3,
            name: 'Dr. Williams',
            email: 'williams@university.edu',
            department: 'Physics'
          }
        ]
      }
    }
    
    if (url === '/professors/me/slots') {
      return {
        data: [
          {
            id: 1,
            start_time: new Date(Date.now() + 86400000).toISOString(),
            end_time: new Date(Date.now() + 86400000 + 1800000).toISOString(),
            is_booked: true,
            location: 'Room 301',
            max_students: 1,
            duration_minutes: 30,
            current_bookings: 1
          },
          {
            id: 2,
            start_time: new Date(Date.now() + 172800000).toISOString(),
            end_time: new Date(Date.now() + 172800000 + 1800000).toISOString(),
            is_booked: false,
            location: 'Room 301',
            max_students: 1,
            duration_minutes: 30,
            current_bookings: 0
          }
        ]
      }
    }
    
    if (url === '/professors/me/bookings') {
      return {
        data: [
          {
            id: 1,
            status: 'confirmed',
            start_time: new Date(Date.now() + 86400000).toISOString(),
            student_name: 'Alice Brown',
            student_id: 101,
            professor_name: 'Dr. Smith',
            duration_minutes: 30,
            location: 'Room 301',
            notes: 'Need help with assignment 3'
          }
        ]
      }
    }
    
    if (url === '/professors/1/slots' || url === '/professors/2/slots' || url === '/professors/3/slots') {
      return {
        data: [
          {
            id: Date.now(),
            start_time: new Date(Date.now() + 86400000).toISOString(),
            end_time: new Date(Date.now() + 86400000 + 1800000).toISOString(),
            is_booked: false,
            location: 'Office Hours Room',
            max_students: 1,
            duration_minutes: 30,
            current_bookings: 0
          },
          {
            id: Date.now() + 1,
            start_time: new Date(Date.now() + 172800000).toISOString(),
            end_time: new Date(Date.now() + 172800000 + 1800000).toISOString(),
            is_booked: false,
            location: 'Office Hours Room',
            max_students: 1,
            duration_minutes: 30,
            current_bookings: 0
          }
        ]
      }
    }
    
    throw new Error('Mock endpoint not implemented: ' + url)
  },
  
  delete: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { success: true } }
  }
}

const realApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' }
})

realApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

realApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const api = MOCK_MODE ? mockApi : realApi
export default api