import { createContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService.js'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } catch (e) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }
    
    initAuth()
  }, [])

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials)
    const { token, user: userData } = response.data
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    
    return userData
  }, [])

  const register = useCallback(async (userData) => {
    const response = await authService.register(userData)
    const { token, user: newUser } = response.data
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
    
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const isProfessor = () => user?.role === 'professor'
  const isStudent = () => user?.role === 'student'

  const value = {
    user,
    login,
    register,
    logout,
    isProfessor,
    isStudent,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}