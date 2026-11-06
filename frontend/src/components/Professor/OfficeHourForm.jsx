import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { validateFutureDate, validateTimeSlot } from '../../utils/validators.js'
import { Plus, Calendar, Clock, MapPin } from 'lucide-react'

const OfficeHourForm = ({ onSubmit }) => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleFormSubmit = async (data) => {
    setLoading(true)
    setSubmitError('')
    try {
      // Inputs are in the professor's local time; send UTC to the API
      await onSubmit({
        start_time: new Date(`${data.date}T${data.start_time}`).toISOString(),
        end_time: new Date(`${data.date}T${data.end_time}`).toISOString(),
        location: data.location,
        max_students: parseInt(data.max_students) || 1,
        notes: data.notes || null
      })
      reset()
    } catch (err) {
      setSubmitError(err.message || 'Failed to create slot')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Plus size={20} className="text-primary-600" />
        Create Office Hour Slot
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {submitError && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{submitError}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                {...register('date', { 
                  required: 'Date is required',
                  validate: value => value >= format(new Date(), 'yyyy-MM-dd') || 'Date cannot be in the past'
                })}
                className="input-field pl-10"
              />
            </div>
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                {...register('location', { required: 'Location is required' })}
                className="input-field pl-10"
                placeholder="Room 301, Office Hours Room..."
              />
            </div>
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="time"
                {...register('start_time', {
                  required: 'Start time is required',
                  validate: value => {
                    const date = watch('date')
                    return !date || validateFutureDate(`${date}T${value}`) || 'Start time must be in the future'
                  }
                })}
                className="input-field pl-10"
              />
            </div>
            {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              {...register('end_time', { 
                required: 'End time is required',
                validate: value => {
                  const start = watch('start_time')
                  return !start || validateTimeSlot(`2000-01-01T${start}`, `2000-01-01T${value}`) || 'End time must be after start time'
                }
              })}
              className="input-field"
            />
            {errors.end_time && <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Students (default: 1 for individual)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            {...register('max_students', { value: 1 })}
            className="input-field w-32"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            {...register('notes')}
            className="input-field h-20 resize-none"
            placeholder="Any additional information for students..."
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating...' : 'Create Slot'}
        </button>
      </form>
    </div>
  )
}

export default OfficeHourForm