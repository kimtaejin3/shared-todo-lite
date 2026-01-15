import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MySchedule from './pages/MySchedule'
import TeamWorkspace from './pages/TeamWorkspace'
import AddSchedule from './pages/AddSchedule'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 p-6 pb-32 max-w-md mx-auto">
        <Routes>
          <Route path="/" element={<MySchedule />} />
          <Route path="/team" element={<TeamWorkspace />} />
          <Route path="/add" element={<AddSchedule />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
