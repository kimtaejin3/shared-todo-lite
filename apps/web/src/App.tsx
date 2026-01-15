import { useState } from 'react'

interface Todo {
  id: number
  title: string
  time: string
  description: string
  isActive?: boolean
  participants?: string[]
}

function App() {
  const [todos] = useState<Todo[]>([
    {
      id: 1,
      title: 'Wakeup',
      time: '7:00 AM',
      description: 'Early wakeup from bed and fresh',
    },
    {
      id: 2,
      title: 'Morning Excersise',
      time: '8:00 AM',
      description: '4 types of exercise',
    },
    {
      id: 3,
      title: 'Meeting',
      time: '9:00 AM',
      description: 'Zoom call, Discuss team task for the day',
      isActive: true,
      participants: ['👨🏻', '👨🏼', '👩🏻', '👩🏽'],
    },
    {
      id: 4,
      title: 'Breakfast',
      time: '10:00 AM',
      description: 'Moring breakfast with bread, banana egg bowel and tea.',
    },
  ])

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const currentDay = today.getDay()
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - currentDay + i + 1)
    return date.getDate()
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-32 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-400 text-sm mb-2">{dateStr}</p>
        <h1 className="text-4xl font-bold mb-6">Today</h1>
        
        {/* Week Calendar */}
        <div className="flex justify-between items-center">
          {weekDays.map((day, index) => (
            <div key={day} className="text-center">
              <p className={`text-sm mb-2 ${index === 5 ? 'text-blue-500' : 'text-gray-500'}`}>
                {day}
              </p>
              <p className={`text-lg font-semibold ${index === 5 ? 'text-blue-500' : 'text-gray-800'}`}>
                {dates[index]}
              </p>
              {index === 5 ? (
                <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>
              ) : (
                <div className="w-1 h-1 rounded-full mx-auto mt-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4 relative">
        {todos.map((todo, index) => (
          <div key={todo.id} className="flex gap-4">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                todo.isActive 
                  ? 'border-blue-500 bg-blue-500 animate-pulse' 
                  : 'border-blue-300 bg-white'
              }`}>
                {todo.isActive && (
                  <div className="relative">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
              {index < todos.length - 1 && (
                <div className={`w-0.5 ${todo.isActive ? 'h-32' : 'h-24'} bg-blue-200 mt-2`}></div>
              )}
            </div>

            {/* Todo Content */}
            <div className={`flex-1 pb-6 ${
              todo.isActive 
                ? 'bg-blue-500 text-white p-6 rounded-3xl' 
                : 'bg-white p-6 rounded-2xl'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-xl font-semibold ${
                  todo.isActive ? 'text-white' : 'text-gray-900'
                }`}>
                  {todo.title}
                </h3>
                <span className={`text-sm ${
                  todo.isActive ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {todo.time}
                </span>
              </div>
              <p className={`text-sm ${
                todo.isActive ? 'text-blue-50' : 'text-gray-500'
              }`}>
                {todo.description}
              </p>
              
              {/* Participants */}
              {todo.participants && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex -space-x-2">
                    {todo.participants.map((emoji, i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg border-2 border-blue-500"
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 max-w-md mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-lg p-4 flex items-center justify-around">
          <button className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg hover:bg-blue-600 transition-colors -mt-8">
            +
          </button>
          <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
