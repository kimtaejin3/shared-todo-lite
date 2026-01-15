import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isMySchedule = location.pathname === '/'
  const isTeam = location.pathname === '/team'
  const isAddSchedule = location.pathname === '/add'

  return (
    <div className="fixed bottom-6 left-0 right-0 max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-lg p-2 flex items-center justify-around">
        <button 
          onClick={() => navigate('/')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            isMySchedule 
              ? 'bg-blue-500 text-white' 
              : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth="2" />
            <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        
        <button 
          onClick={() => navigate('/add')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${
            isAddSchedule
              ? 'bg-blue-500 text-white'
              : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
          }`}
        >
          +
        </button>
        
        <button 
          onClick={() => navigate('/team')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            isTeam 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

