import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { getErrorMessage } from '../../services/api.js'
import { validateEmail } from '../../utils/validators.js'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const onSubmit = async (data) => {
    try {
      setSubmitError('')
      const user = await login(data)
      navigate(user.role === 'professor' ? '/professor/dashboard' : '/student/dashboard')
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Invalid credentials'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {submitError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            {...register('email', { 
              required: 'Email is required',
              validate: value => validateEmail(value) || 'Invalid email format'
            })}
            type="email"
            className="input-field pl-10"
            placeholder="you@university.edu"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })}
            type={showPassword ? 'text' : 'password'}
            className="input-field pl-10 pr-10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
        Sign In
      </button>
    </form>
  )
}

export default LoginForm