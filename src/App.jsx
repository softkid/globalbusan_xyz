import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Home from './pages/Home'
import Invest from './pages/Invest'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Statistics from './pages/Statistics'
import Admin from './pages/Admin'
import ProjectApplication from './pages/ProjectApplication'
import Donation from './pages/Donation'
import GlobalBusan from './pages/GlobalBusan'
import Roadmap from './pages/Roadmap'
import ConnectionStatus from './components/ConnectionStatus'

// Google OAuth Client ID (환경 변수 또는 기본값 사용)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '299500936836-elk8daqqn64np59q473u66lt9ud0u7cj.apps.googleusercontent.com'

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <ConnectionStatus />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/global-busan" element={<GlobalBusan />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/apply" element={<ProjectApplication />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
