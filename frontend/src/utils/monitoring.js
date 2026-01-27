/**
 * 통합 모니터링 시스템
 * 에러 로깅, 성능 모니터링, 사용자 분석을 통합 관리
 */

import { logError } from './errorHandler'
import { measureWebVitals, collectPerformanceMetrics } from './webVitals'
import { trackEvent, trackPageView } from './analytics'

/**
 * 모니터링 이벤트 타입
 */
export const MonitoringEvents = {
  ERROR: 'error',
  PERFORMANCE: 'performance',
  USER_ACTION: 'user_action',
  PAGE_VIEW: 'page_view',
  API_CALL: 'api_call',
  TRANSACTION: 'transaction',
  PAYMENT: 'payment'
}

/**
 * 모니터링 데이터 저장소 (메모리)
 */
const monitoringData = {
  errors: [],
  performance: [],
  userActions: [],
  apiCalls: [],
  maxStorage: 100 // 최대 저장 항목 수
}

/**
 * 모니터링 데이터를 Supabase에 전송
 */
const sendToBackend = async (data) => {
  try {
    // Supabase Edge Function 또는 직접 API 호출
    const response = await fetch('/api/monitoring', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      console.warn('Failed to send monitoring data to backend')
    }
  } catch (error) {
    console.warn('Error sending monitoring data:', error)
  }
}

/**
 * 모니터링 데이터를 로컬 스토리지에 저장 (백엔드 전송 실패 시)
 */
const saveToLocalStorage = (data) => {
  try {
    const stored = localStorage.getItem('monitoring_queue') || '[]'
    const queue = JSON.parse(stored)
    queue.push(data)
    
    // 최대 50개까지만 저장
    if (queue.length > 50) {
      queue.shift()
    }
    
    localStorage.setItem('monitoring_queue', JSON.stringify(queue))
  } catch (error) {
    console.warn('Failed to save monitoring data to localStorage:', error)
  }
}

/**
 * 에러 모니터링
 */
export const monitorError = (error, context = {}) => {
  const errorData = logError(error, context)
  
  // 메모리에 저장
  monitoringData.errors.push({
    ...errorData,
    timestamp: Date.now()
  })
  
  // 최대 저장 항목 수 제한
  if (monitoringData.errors.length > monitoringData.maxStorage) {
    monitoringData.errors.shift()
  }
  
  // Google Analytics에 전송
  trackEvent('error', {
    error_type: errorData.type,
    error_message: errorData.message,
    ...context
  })
  
  // 백엔드에 전송 (선택적)
  if (import.meta.env.PROD) {
    sendToBackend({
      type: MonitoringEvents.ERROR,
      data: errorData
    }).catch(() => {
      saveToLocalStorage({ type: MonitoringEvents.ERROR, data: errorData })
    })
  }
  
  return errorData
}

/**
 * 성능 모니터링
 */
export const monitorPerformance = (metrics) => {
  const performanceData = {
    ...metrics,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent
  }
  
  // 메모리에 저장
  monitoringData.performance.push(performanceData)
  
  // 최대 저장 항목 수 제한
  if (monitoringData.performance.length > monitoringData.maxStorage) {
    monitoringData.performance.shift()
  }
  
  // Google Analytics에 전송
  trackEvent('performance', metrics)
  
  // 백엔드에 전송 (선택적)
  if (import.meta.env.PROD) {
    sendToBackend({
      type: MonitoringEvents.PERFORMANCE,
      data: performanceData
    }).catch(() => {
      saveToLocalStorage({ type: MonitoringEvents.PERFORMANCE, data: performanceData })
    })
  }
  
  return performanceData
}

/**
 * 사용자 액션 모니터링
 */
export const monitorUserAction = (action, details = {}) => {
  const actionData = {
    action,
    details,
    timestamp: Date.now(),
    url: window.location.href
  }
  
  // 메모리에 저장
  monitoringData.userActions.push(actionData)
  
  // 최대 저장 항목 수 제한
  if (monitoringData.userActions.length > monitoringData.maxStorage) {
    monitoringData.userActions.shift()
  }
  
  // Google Analytics에 전송
  trackEvent('user_action', {
    action,
    ...details
  })
  
  return actionData
}

/**
 * API 호출 모니터링
 */
export const monitorApiCall = (endpoint, method, duration, status, error = null) => {
  const apiData = {
    endpoint,
    method,
    duration,
    status,
    error: error?.message,
    timestamp: Date.now()
  }
  
  // 메모리에 저장
  monitoringData.apiCalls.push(apiData)
  
  // 최대 저장 항목 수 제한
  if (monitoringData.apiCalls.length > monitoringData.maxStorage) {
    monitoringData.apiCalls.shift()
  }
  
  // Google Analytics에 전송
  trackEvent('api_call', {
    endpoint,
    method,
    duration,
    status: status >= 200 && status < 300 ? 'success' : 'error'
  })
  
  // 백엔드에 전송 (선택적)
  if (import.meta.env.PROD && (status >= 400 || error)) {
    sendToBackend({
      type: MonitoringEvents.API_CALL,
      data: apiData
    }).catch(() => {
      saveToLocalStorage({ type: MonitoringEvents.API_CALL, data: apiData })
    })
  }
  
  return apiData
}

/**
 * 트랜잭션 모니터링
 */
export const monitorTransaction = (transactionData) => {
  const data = {
    ...transactionData,
    timestamp: Date.now()
  }
  
  // Google Analytics에 전송
  trackEvent('transaction', transactionData)
  
  // 백엔드에 전송
  if (import.meta.env.PROD) {
    sendToBackend({
      type: MonitoringEvents.TRANSACTION,
      data
    }).catch(() => {
      saveToLocalStorage({ type: MonitoringEvents.TRANSACTION, data })
    })
  }
  
  return data
}

/**
 * 결제 모니터링
 */
export const monitorPayment = (paymentData) => {
  const data = {
    ...paymentData,
    timestamp: Date.now()
  }
  
  // Google Analytics에 전송
  trackEvent('payment', {
    amount: paymentData.amount,
    currency: paymentData.currency,
    method: paymentData.method,
    status: paymentData.status
  })
  
  // 백엔드에 전송
  if (import.meta.env.PROD) {
    sendToBackend({
      type: MonitoringEvents.PAYMENT,
      data
    }).catch(() => {
      saveToLocalStorage({ type: MonitoringEvents.PAYMENT, data })
    })
  }
  
  return data
}

/**
 * 모니터링 데이터 조회
 */
export const getMonitoringData = () => {
  return {
    errors: [...monitoringData.errors],
    performance: [...monitoringData.performance],
    userActions: [...monitoringData.userActions],
    apiCalls: [...monitoringData.apiCalls]
  }
}

/**
 * 모니터링 데이터 초기화
 */
export const clearMonitoringData = () => {
  monitoringData.errors = []
  monitoringData.performance = []
  monitoringData.userActions = []
  monitoringData.apiCalls = []
  localStorage.removeItem('monitoring_queue')
}

/**
 * 로컬 스토리지에 저장된 모니터링 데이터 재전송
 */
export const retryFailedMonitoring = async () => {
  try {
    const stored = localStorage.getItem('monitoring_queue')
    if (!stored) return
    
    const queue = JSON.parse(stored)
    if (queue.length === 0) return
    
    // 백엔드에 재전송 시도
    for (const item of queue) {
      try {
        await sendToBackend(item)
      } catch (error) {
        console.warn('Failed to retry monitoring data:', error)
        break // 실패하면 중단
      }
    }
    
    // 성공한 항목들은 제거
    localStorage.removeItem('monitoring_queue')
  } catch (error) {
    console.warn('Error retrying failed monitoring:', error)
  }
}

/**
 * 모니터링 시스템 초기화
 */
export const initMonitoring = () => {
  // Web Vitals 측정
  measureWebVitals((metric) => {
    monitorPerformance({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      rating: metric.rating
    })
  })
  
  // 성능 메트릭 수집
  if (document.readyState === 'complete') {
    collectPerformanceMetrics().then(metrics => {
      monitorPerformance(metrics)
    })
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        collectPerformanceMetrics().then(metrics => {
          monitorPerformance(metrics)
        })
      }, 0)
    })
  }
  
  // 페이지 뷰 추적
  trackPageView(window.location.pathname)
  
  // 주기적으로 실패한 모니터링 데이터 재전송 (5분마다)
  if (import.meta.env.PROD) {
    setInterval(retryFailedMonitoring, 5 * 60 * 1000)
  }
  
  // 페이지 언로드 시 대기 중인 데이터 전송
  window.addEventListener('beforeunload', () => {
    retryFailedMonitoring()
  })
}

/**
 * 모니터링 서비스 객체
 */
export const monitoringService = {
  monitorError,
  monitorPerformance,
  monitorUserAction,
  monitorApiCall,
  monitorTransaction,
  monitorPayment,
  getMonitoringData,
  clearMonitoringData,
  retryFailedMonitoring,
  initMonitoring
}

