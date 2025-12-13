import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ConnectionStatus from './components/ConnectionStatus'
import MobileHeader from './components/MobileHeader'
import BottomNav from './components/BottomNav'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Invest = lazy(() => import('./pages/Invest'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Statistics = lazy(() => import('./pages/Statistics'))
const Admin = lazy(() => import('./pages/Admin'))
const ProjectApplication = lazy(() => import('./pages/ProjectApplication'))
const Donation = lazy(() => import('./pages/Donation'))
const GlobalBusan = lazy(() => import('./pages/GlobalBusan'))
const Roadmap = lazy(() => import('./pages/Roadmap'))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <div className="text-white text-xl">페이지를 불러오는 중...</div>
    </div>
  </div>
)

// Google OAuth Client ID (환경 변수 또는 기본값 사용)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '299500936836-elk8daqqn64np59q473u66lt9ud0u7cj.apps.googleusercontent.com'

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <ConnectionStatus />
        <MobileHeader />
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
        <BottomNav />
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
