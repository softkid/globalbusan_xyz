import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { setupGlobalErrorHandlers } from './utils/errorHandler.js'
import { registerServiceWorker } from './utils/serviceWorker.js'
import { initPerformanceMonitoring } from './utils/webVitals.js'
import { initMonitoring } from './utils/monitoring.js'
import './index.css'
import './i18n/config'

// 전역 에러 핸들러를 가장 먼저 설정 (다른 스크립트보다 우선)
// 이렇게 하면 확장 프로그램 오류를 최대한 빨리 필터링할 수 있음
setupGlobalErrorHandlers()

// 통합 모니터링 시스템 초기화 (에러, 성능, 사용자 분석 포함)
initMonitoring()

// 성능 모니터링 초기화 (기존 호환성 유지)
initPerformanceMonitoring()

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
