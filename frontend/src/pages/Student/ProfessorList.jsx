import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { professorService } from '../../services/professorService.js'
import { Search, Mail, Building2, ArrowRight, User } from 'lucide-react'

const ProfessorList = () => {
  const [professors, setProfessors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await professorService.getAllProfessors()
        setProfessors(response.data)
      } catch (err) {
        console.error('Failed to fetch professors:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfessors()
  }, [])

  const filteredProfessors = professors.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find a Professor</h1>
        <p className="text-gray-600 mt-1">Browse and book office hours with your professors</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, department, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfessors.map(professor => (
            <div key={professor.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xl font-bold flex-shrink-0">
                  {professor.name?.charAt(0) || <User size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{professor.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Building2 size={14} />
                    {professor.department || 'Department N/A'}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Mail size={14} />
                    <span className="truncate">{professor.email}</span>
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => navigate(`/student/book/${professor.id}`)}
                className="mt-4 w-full flex items-center justify-center gap-2 text-primary-600 hover:bg-primary-50 py-2 rounded-lg transition-colors font-medium"
              >
                View Availability <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProfessors.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No professors found matching your search.</p>
        </div>
      )}
    </div>
  )
}

export default ProfessorList