import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Invest from './pages/Invest'
import Projects from './pages/Projects'
import Statistics from './pages/Statistics'
import Admin from './pages/Admin'
import ConnectionStatus from './components/ConnectionStatus'

function App() {
  return (
    <Router>
      <ConnectionStatus />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App
