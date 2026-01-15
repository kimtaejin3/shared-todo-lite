import { useState } from 'react'

interface Todo {
  id: number
  title: string
  time: string
  description: string
  isActive?: boolean
  participants?: string[]
}

export default function MySchedule() {
  const today = new Date()
  const currentDayOfWeek = today.getDay()
  const [selectedDay, setSelectedDay] = useState((currentDayOfWeek + 6) % 7)

  const parseTimeToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ')
    const [hoursStr, minutesStr] = time.split(':')
    let hours = Number(hoursStr)
    const minutes = Number(minutesStr)
    
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    
    return hours * 60 + minutes
  }

  const isTimeActive = (timeStr: string, nextTimeStr?: string): boolean => {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const todoMinutes = parseTimeToMinutes(timeStr)
    
    if (nextTimeStr) {
      const nextMinutes = parseTimeToMinutes(nextTimeStr)
      return currentMinutes >= todoMinutes && currentMinutes < nextMinutes
    }
    
    return currentMinutes >= todoMinutes && currentMinutes < todoMinutes + 120
  }

  const todosByDayBase: Record<number, Omit<Todo, 'isActive'>[]> = {
    0: [
      { id: 1, title: 'Team Standup', time: '9:00 AM', description: 'Weekly team sync meeting' },
      { id: 2, title: 'Code Review', time: '11:00 AM', description: 'Review pull requests' },
      { id: 3, title: 'Lunch Break', time: '12:30 PM', description: 'Lunch with team' },
    ],
    1: [
      { id: 1, title: 'Gym', time: '6:30 AM', description: 'Morning workout session' },
      { id: 2, title: 'Client Call', time: '10:00 AM', description: 'Discuss project requirements', participants: ['👨🏻', '👩🏼'] },
      { id: 3, title: 'Development', time: '2:00 PM', description: 'Work on new features' },
    ],
    2: [
      { id: 1, title: 'Meditation', time: '7:00 AM', description: 'Morning meditation routine' },
      { id: 2, title: 'Sprint Planning', time: '9:30 AM', description: 'Plan sprint tasks', participants: ['👨🏻', '👨🏼', '👩🏻', '👩🏽'] },
      { id: 3, title: 'Lunch', time: '1:00 PM', description: 'Lunch break' },
      { id: 4, title: 'Documentation', time: '3:00 PM', description: 'Update project docs' },
    ],
    3: [
      { id: 1, title: 'Wakeup', time: '7:00 AM', description: 'Early wakeup from bed and fresh' },
      { id: 2, title: 'Morning Excersise', time: '8:00 AM', description: '4 types of exercise' },
      { id: 3, title: 'Meeting', time: '1:00 PM', description: 'Zoom call, Discuss team task for the day', participants: ['👨🏻', '👨🏼', '👩🏻', '👩🏽'] },
      { id: 4, title: 'Breakfast', time: '3:00 PM', description: 'Moring breakfast with bread, banana egg bowel and tea.' },
    ],
    4: [
      { id: 1, title: 'Coffee Time', time: '8:00 AM', description: 'Morning coffee and news' },
      { id: 2, title: 'Demo Day', time: '11:00 AM', description: 'Show progress to stakeholders', participants: ['👨🏻', '👩🏻', '👩🏽'] },
      { id: 3, title: 'Team Lunch', time: '1:00 PM', description: 'Friday team lunch' },
    ],
    5: [
      { id: 1, title: 'Morning Run', time: '8:00 AM', description: '5km morning run' },
      { id: 2, title: 'Brunch', time: '11:00 AM', description: 'Brunch with friends', participants: ['👨🏻', '👩🏻'] },
      { id: 3, title: 'Shopping', time: '3:00 PM', description: 'Grocery shopping' },
    ],
    6: [
      { id: 1, title: 'Sleep In', time: '9:00 AM', description: 'Relaxing morning' },
      { id: 2, title: 'Family Time', time: '12:00 PM', description: 'Lunch with family', participants: ['👨🏻', '👩🏻', '👦🏻'] },
      { id: 3, title: 'Meal Prep', time: '5:00 PM', description: 'Prepare meals for the week' },
    ],
  }

  const baseTodos = todosByDayBase[selectedDay] || []
  const isToday = selectedDay === (currentDayOfWeek + 6) % 7
  
  const todos: Todo[] = baseTodos.map((todo, index) => ({
    ...todo,
    isActive: isToday ? isTimeActive(todo.time, baseTodos[index + 1]?.time) : false,
  }))

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
    <>
      <div className="mb-8">
        <p className="text-gray-400 text-sm mb-2">{dateStr}</p>
        <h1 className="text-4xl font-bold mb-6">My Schedule</h1>
        
        <div className="flex justify-between items-center">
          {weekDays.map((day, index) => (
            <button 
              key={day} 
              onClick={() => setSelectedDay(index)}
              className="text-center hover:scale-110 transition-transform cursor-pointer"
            >
              <p className={`text-sm mb-2 ${index === selectedDay ? 'text-blue-500' : 'text-gray-500'}`}>
                {day}
              </p>
              <p className={`text-lg font-semibold ${index === selectedDay ? 'text-blue-500' : 'text-gray-800'}`}>
                {dates[index]}
              </p>
              <div className={`w-1 h-1 ${index === selectedDay ? 'bg-blue-500' : ''} rounded-full mx-auto mt-1`}></div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 relative">
        {todos.map((todo, index) => (
          <div key={todo.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                todo.isActive 
                  ? 'border-blue-500 bg-blue-500' 
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
                <div className={`w-0.5 ${todo.participants ? 'h-32' : 'h-24'} bg-blue-200 mt-2`}></div>
              )}
            </div>

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
    </>
  )
}

