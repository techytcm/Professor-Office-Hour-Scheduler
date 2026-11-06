import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { getErrorMessage } from '../../services/api.js'
import { validateEmail } from '../../utils/validators.js'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap } from 'lucide-react'

const RegisterForm = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const onSubmit = async (data) => {
    try {
      setSubmitError('')
      // confirm_password is only for the form; department only applies to professors
      const { confirm_password, department, ...payload } = data
      if (data.role === 'professor' && department?.trim()) payload.department = department.trim()
      const user = await registerUser(payload)
      navigate(user.role === 'professor' ? '/professor/dashboard' : '/student/dashboard')
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Registration failed'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('first_name', { required: 'First name is required' })}
              className="input-field pl-10"
              placeholder="John"
            />
          </div>
          {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            {...register('last_name', { required: 'Last name is required' })}
            className="input-field"
            placeholder="Doe"
          />
          {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>}
        </div>
      </div>

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
        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            {...register('role', { required: 'Role is required' })}
            className="input-field pl-10"
          >
            <option value="">Select role...</option>
            <option value="student">Student</option>
            <option value="professor">Professor</option>
          </select>
        </div>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
      </div>

      {watch('role') === 'professor' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <input
            {...register('department')}
            className="input-field"
            placeholder="Computer Science"
          />
        </div>
      )}

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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <input
          {...register('confirm_password', { 
            required: 'Please confirm password',
            validate: value => value === watch('password') || 'Passwords do not match'
          })}
          type="password"
          className="input-field"
          placeholder="••••••••"
        />
        {errors.confirm_password && <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
        Create Account
      </button>
    </form>
  )
}

export default RegisterForm