/**
 * Service Worker Registration
 * Service Worker 등록 및 업데이트 관리
 */

/**
 * Service Worker 등록
 */
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('[Service Worker] Registered:', registration.scope)

      // 업데이트 확인
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 새 버전 사용 가능
            console.log('[Service Worker] New version available')
            showUpdateNotification()
          }
        })
      })

      // 주기적으로 업데이트 확인 (1시간마다)
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)

      return registration
    } catch (error) {
      console.error('[Service Worker] Registration failed:', error)
      return null
    }
  } else {
    console.warn('[Service Worker] Not supported')
    return null
  }
}

/**
 * Service Worker 업데이트 알림
 */
const showUpdateNotification = () => {
  // 사용자에게 새 버전 알림 (실제로는 toast 라이브러리 사용 권장)
  if (confirm('새 버전이 사용 가능합니다. 지금 업데이트하시겠습니까?')) {
    window.location.reload()
  }
}

/**
 * Service Worker 제거 (개발용)
 */
export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.unregister()
      console.log('[Service Worker] Unregistered')
    } catch (error) {
      console.error('[Service Worker] Unregistration failed:', error)
    }
  }
}

