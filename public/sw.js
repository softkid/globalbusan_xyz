/**
 * Service Worker for Offline Support and Caching
 * 오프라인 지원 및 캐싱을 위한 Service Worker
 */

const CACHE_NAME = 'global-busan-v1'
const RUNTIME_CACHE = 'global-busan-runtime-v1'

// 캐싱할 정적 리소스
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
]

// 네트워크 우선 전략을 사용할 경로
const NETWORK_FIRST_PATTERNS = [
  /^https:\/\/.*\.supabase\.co/,
  /^https:\/\/www\.googletagmanager\.com/,
  /^https:\/\/fonts\.googleapis\.com/,
]

// 캐싱하지 않을 경로 (항상 네트워크에서 가져오기)
const NO_CACHE_PATTERNS = [
  /\/sitemap\.xml$/,
  /\/robots\.txt$/,
  /\/manifest\.json$/,
]

// 캐시 우선 전략을 사용할 경로
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  /\.(?:js|css)$/,
  /^https:\/\/fonts\.gstatic\.com/,
]

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  
  // 즉시 활성화
  self.skipWaiting()
})

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName !== CACHE_NAME &&
              cacheName !== RUNTIME_CACHE
            )
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
      )
    })
  )
  
  // 즉시 클라이언트 제어
  return self.clients.claim()
})

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 같은 출처 요청만 처리
  if (url.origin !== location.origin && !isExternalCacheable(url)) {
    return
  }

  // GET 요청만 캐싱
  if (request.method !== 'GET') {
    return
  }

  event.respondWith(handleRequest(request))
})

/**
 * 요청 처리 전략 선택
 */
async function handleRequest(request) {
  const url = new URL(request.url)

  // 캐싱하지 않을 경로 (항상 네트워크에서만 가져오기)
  if (isNoCache(url)) {
    return networkOnly(request)
  }

  // 네트워크 우선 전략
  if (isNetworkFirst(url)) {
    return networkFirst(request)
  }

  // 캐시 우선 전략
  if (isCacheFirst(url)) {
    return cacheFirst(request)
  }

  // 기본: 네트워크 우선, 실패 시 캐시
  return networkFirst(request)
}

/**
 * 네트워크 전용 전략 (캐싱하지 않음)
 */
async function networkOnly(request) {
  try {
    const response = await fetch(request)
    return response
  } catch (error) {
    // 네트워크 실패 시에도 캐시를 사용하지 않음
    throw error
  }
}

/**
 * 네트워크 우선 전략
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    
    // 성공한 응답을 캐시에 저장
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    // 네트워크 실패 시 캐시에서 가져오기
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 오프라인 페이지 반환
    if (request.mode === 'navigate') {
      return caches.match('/index.html')
    }
    
    throw error
  }
}

/**
 * 캐시 우선 전략
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    // 오프라인 페이지 반환
    if (request.mode === 'navigate') {
      return caches.match('/index.html')
    }
    
    throw error
  }
}

/**
 * 네트워크 우선 패턴 확인
 */
function isNetworkFirst(url) {
  return NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(url.href))
}

/**
 * 캐시 우선 패턴 확인
 */
function isCacheFirst(url) {
  return CACHE_FIRST_PATTERNS.some((pattern) => pattern.test(url.href))
}

/**
 * 캐싱하지 않을 패턴 확인
 */
function isNoCache(url) {
  return NO_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))
}

/**
 * 외부 리소스 캐싱 가능 여부 확인
 */
function isExternalCacheable(url) {
  return (
    url.href.includes('fonts.googleapis.com') ||
    url.href.includes('fonts.gstatic.com') ||
    url.href.includes('googletagmanager.com')
  )
}

