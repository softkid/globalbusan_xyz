/**
 * Global Error Handler
 * 애플리케이션 전역 에러 처리 유틸리티
 */

/**
 * 에러 타입 정의
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  BLOCKCHAIN: 'BLOCKCHAIN_ERROR',
  PAYMENT: 'PAYMENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

/**
 * 에러 로깅 및 추적
 */
export const logError = (error, errorInfo = {}) => {
  const errorData = {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    type: errorInfo.type || ErrorTypes.UNKNOWN,
    context: errorInfo.context || {},
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  }

  // 콘솔에 에러 출력 (개발 환경)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorData)
  }

  // Google Analytics에 에러 전송
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: errorData.message,
      fatal: errorInfo.fatal !== false,
      error_type: errorData.type
    })
  }

  // 에러 추적 서비스에 전송 (예: Sentry)
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, {
  //     contexts: {
  //       custom: errorData.context
  //     },
  //     tags: {
  //       errorType: errorData.type
  //     }
  //   })
  // }

  return errorData
}

/**
 * 네트워크 에러 처리
 */
export const handleNetworkError = (error, context = {}) => {
  const errorInfo = {
    type: ErrorTypes.NETWORK,
    context: {
      ...context,
      networkStatus: navigator.onLine ? 'online' : 'offline'
    },
    fatal: false
  }

  logError(error, errorInfo)

  return {
    message: '네트워크 연결을 확인해주세요.',
    type: ErrorTypes.NETWORK,
    retryable: true
  }
}

/**
 * API 에러 처리
 */
export const handleAPIError = (error, context = {}) => {
  const errorInfo = {
    type: ErrorTypes.API,
    context: {
      ...context,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: error?.config?.url
    },
    fatal: false
  }

  logError(error, errorInfo)

  let message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  
  if (error?.response?.status === 404) {
    message = '요청한 리소스를 찾을 수 없습니다.'
  } else if (error?.response?.status === 401) {
    message = '인증이 필요합니다. 다시 로그인해주세요.'
  } else if (error?.response?.status === 403) {
    message = '접근 권한이 없습니다.'
  } else if (error?.response?.status >= 500) {
    message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }

  return {
    message,
    type: ErrorTypes.API,
    status: error?.response?.status,
    retryable: error?.response?.status >= 500
  }
}

/**
 * 블록체인 에러 처리
 */
export const handleBlockchainError = (error, context = {}) => {
  const errorInfo = {
    type: ErrorTypes.BLOCKCHAIN,
    context: {
      ...context,
      network: context.network || 'unknown'
    },
    fatal: false
  }

  logError(error, errorInfo)

  let message = '블록체인 트랜잭션 처리 중 오류가 발생했습니다.'
  
  if (error?.message?.includes('user rejected')) {
    message = '트랜잭션이 취소되었습니다.'
  } else if (error?.message?.includes('insufficient funds')) {
    message = '잔액이 부족합니다.'
  } else if (error?.message?.includes('network')) {
    message = '네트워크 연결을 확인해주세요.'
  }

  return {
    message,
    type: ErrorTypes.BLOCKCHAIN,
    retryable: !error?.message?.includes('user rejected')
  }
}

/**
 * 결제 에러 처리
 */
export const handlePaymentError = (error, context = {}) => {
  const errorInfo = {
    type: ErrorTypes.PAYMENT,
    context: {
      ...context,
      paymentMethod: context.paymentMethod || 'unknown'
    },
    fatal: false
  }

  logError(error, errorInfo)

  let message = '결제 처리 중 오류가 발생했습니다.'
  
  if (error?.code === 'card_declined') {
    message = '카드가 거부되었습니다. 다른 결제 수단을 사용해주세요.'
  } else if (error?.code === 'insufficient_funds') {
    message = '잔액이 부족합니다.'
  } else if (error?.code === 'expired_card') {
    message = '만료된 카드입니다.'
  }

  return {
    message,
    type: ErrorTypes.PAYMENT,
    retryable: true
  }
}

/**
 * 브라우저 확장 프로그램 오류 패턴
 */
const EXTENSION_ERROR_PATTERNS = [
  /extension:\/\//i,
  /chrome-extension:\/\//i,
  /moz-extension:\/\//i,
  /solanaActionsContentScript/i,
  /content\.js/i,
  /Cannot use 'in' operator to search for 'animation' in undefined/i,
  /createLucideIcon/i,
  /web-helper\.ts-loader/i,
]

/**
 * 브라우저 확장 프로그램 오류인지 확인
 */
const isExtensionError = (error) => {
  if (!error) return false
  
  const errorString = JSON.stringify(error)
  const message = error?.message || error?.toString() || ''
  const filename = error?.filename || error?.source || ''
  const stack = error?.stack || ''
  
  const fullErrorText = `${errorString} ${message} ${filename} ${stack}`
  
  return EXTENSION_ERROR_PATTERNS.some(pattern => pattern.test(fullErrorText))
}

/**
 * 전역 에러 핸들러 설정
 */
export const setupGlobalErrorHandlers = () => {
  // Unhandled Promise Rejection
  window.addEventListener('unhandledrejection', (event) => {
    // 브라우저 확장 프로그램 오류는 무시
    if (isExtensionError(event.reason)) {
      return
    }
    
    logError(event.reason, {
      type: ErrorTypes.UNKNOWN,
      context: {
        reason: 'unhandled_promise_rejection'
      }
    })
    
    // 개발 환경에서만 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('Unhandled promise rejection:', event.reason)
    }
  })

  // 일반 JavaScript 에러
  window.addEventListener('error', (event) => {
    // 브라우저 확장 프로그램 오류는 무시
    if (isExtensionError(event.error || event)) {
      return
    }
    
    logError(event.error || new Error(event.message), {
      type: ErrorTypes.UNKNOWN,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    })
  })

  // Console Error Override (확장 프로그램 오류 필터링)
  const originalConsoleError = console.error
  console.error = (...args) => {
    const errorText = args.join(' ')
    if (EXTENSION_ERROR_PATTERNS.some(pattern => pattern.test(errorText))) {
      return // 확장 프로그램 오류는 무시
    }
    originalConsoleError.apply(console, args)
  }
}

/**
 * 에러 메시지 표시 헬퍼
 */
export const showErrorToast = (message, duration = 5000) => {
  // 간단한 토스트 메시지 표시 (실제로는 toast 라이브러리 사용 권장)
  const toast = document.createElement('div')
  toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, duration)
}

