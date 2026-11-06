import { Link } from 'react-router-dom'
import RegisterForm from '../../components/Auth/RegisterForm.jsx'
import { GraduationCap } from 'lucide-react'

const Register = () => {
  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <GraduationCap size={32} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Get Started</h1>
          <p className="text-gray-600 mt-2">Create your account to book or manage office hours</p>
        </div>

        <div className="card">
          <RegisterForm />
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register