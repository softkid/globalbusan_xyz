import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { setupGlobalErrorHandlers } from './utils/errorHandler.js'
import { registerServiceWorker } from './utils/serviceWorker.js'
import './index.css'
import './i18n/config'

// 전역 에러 핸들러 설정
setupGlobalErrorHandlers()

// Service Worker 등록 (프로덕션 환경에서만)
if (import.meta.env.PROD) {
  registerServiceWorker()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
