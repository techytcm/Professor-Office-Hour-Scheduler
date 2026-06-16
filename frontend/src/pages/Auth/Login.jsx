import { Link } from 'react-router-dom'
import LoginForm from '../../components/Auth/LoginForm.jsx'
import { GraduationCap } from 'lucide-react'

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 -mt-[73px] -mb-[57px]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <GraduationCap size={32} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your office hours</p>
        </div>

        <div className="card">
          <LoginForm />
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login