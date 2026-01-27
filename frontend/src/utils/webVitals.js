/**
 * Web Vitals Performance Monitoring
 * Google Core Web Vitals 측정 및 Google Analytics 전송
 */

/**
 * LCP (Largest Contentful Paint) 측정
 */
export const measureLCP = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onLCP }) => {
      onLCP(onPerfEntry)
    })
  }
}

/**
 * FID (First Input Delay) 측정
 */
export const measureFID = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onFID }) => {
      onFID(onPerfEntry)
    })
  }
}

/**
 * CLS (Cumulative Layout Shift) 측정
 */
export const measureCLS = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS }) => {
      onCLS(onPerfEntry)
    })
  }
}

/**
 * FCP (First Contentful Paint) 측정
 */
export const measureFCP = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onFCP }) => {
      onFCP(onPerfEntry)
    })
  }
}

/**
 * TTFB (Time to First Byte) 측정
 */
export const measureTTFB = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onTTFB }) => {
      onTTFB(onPerfEntry)
    })
  }
}

/**
 * 모든 Web Vitals 측정
 */
export const measureWebVitals = () => {
  const reportWebVitals = (metric) => {
    // 콘솔에 출력 (개발 환경)
    if (process.env.NODE_ENV === 'development') {
      console.log(metric)
    }

    // Google Analytics에 전송
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // Custom Analytics (선택사항)
    if (window.customAnalytics && typeof window.customAnalytics.track === 'function') {
      window.customAnalytics.track('web_vital', {
        name: metric.name,
        value: metric.value,
        id: metric.id,
        rating: metric.rating,
      })
    }
  }

  // 모든 Web Vitals 측정
  measureLCP(reportWebVitals)
  measureFID(reportWebVitals)
  measureCLS(reportWebVitals)
  measureFCP(reportWebVitals)
  measureTTFB(reportWebVitals)
}

/**
 * 성능 메트릭 수집 (Performance API 사용)
 */
export const collectPerformanceMetrics = () => {
  if (!window.performance || !window.performance.timing) {
    return null
  }

  const timing = window.performance.timing
  const navigation = window.performance.navigation

  const metrics = {
    // DNS 조회 시간
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    
    // TCP 연결 시간
    tcp: timing.connectEnd - timing.connectStart,
    
    // 요청 시간
    request: timing.responseStart - timing.requestStart,
    
    // 응답 시간
    response: timing.responseEnd - timing.responseStart,
    
    // DOM 처리 시간
    domProcessing: timing.domComplete - timing.domLoading,
    
    // 페이지 로드 시간
    pageLoad: timing.loadEventEnd - timing.navigationStart,
    
    // 리소스 로드 시간
    resourceLoad: timing.loadEventEnd - timing.domContentLoadedEventEnd,
    
    // 리다이렉트 횟수
    redirects: navigation.redirectCount,
    
    // 리다이렉트 시간
    redirectTime: timing.redirectEnd - timing.redirectStart,
  }

  // Google Analytics에 전송
  if (window.gtag) {
    Object.keys(metrics).forEach((key) => {
      if (metrics[key] > 0) {
        window.gtag('event', 'performance_metric', {
          metric_name: key,
          metric_value: metrics[key],
          event_category: 'Performance',
          non_interaction: true,
        })
      }
    })
  }

  return metrics
}

/**
 * 리소스 타이밍 수집
 */
export const collectResourceTiming = () => {
  if (!window.performance || !window.performance.getEntriesByType) {
    return []
  }

  const resources = window.performance.getEntriesByType('resource')
  
  return resources.map((resource) => ({
    name: resource.name,
    duration: resource.duration,
    size: resource.transferSize,
    type: resource.initiatorType,
    startTime: resource.startTime,
  }))
}

/**
 * 성능 모니터링 초기화
 */
export const initPerformanceMonitoring = () => {
  // Web Vitals 측정
  measureWebVitals()

  // 페이지 로드 완료 후 성능 메트릭 수집
  if (document.readyState === 'complete') {
    collectPerformanceMetrics()
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        collectPerformanceMetrics()
      }, 0)
    })
  }

  // 리소스 타이밍 수집 (선택사항, 개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const resources = collectResourceTiming()
        console.log('Resource Timing:', resources)
      }, 0)
    })
  }
}

