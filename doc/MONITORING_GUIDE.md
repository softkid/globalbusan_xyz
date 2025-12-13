# 모니터링 시스템 가이드

## 개요

Global BUSAN 프로젝트의 통합 모니터링 시스템은 에러 로깅, 성능 모니터링, 사용자 분석을 통합 관리합니다.

## 주요 기능

### 1. 에러 모니터링

에러 발생 시 자동으로 추적하고 로깅합니다.

```javascript
import { monitorError } from './utils/monitoring'

try {
  // 코드 실행
} catch (error) {
  monitorError(error, {
    type: 'API_ERROR',
    context: { endpoint: '/api/projects' }
  })
}
```

### 2. 성능 모니터링

Web Vitals 및 사용자 정의 성능 메트릭을 추적합니다.

```javascript
import { monitorPerformance } from './utils/monitoring'

monitorPerformance({
  name: 'custom_metric',
  value: 1234,
  rating: 'good'
})
```

### 3. 사용자 액션 모니터링

사용자의 주요 액션을 추적합니다.

```javascript
import { monitorUserAction } from './utils/monitoring'

monitorUserAction('button_click', {
  button_id: 'invest-button',
  page: '/invest'
})
```

### 4. API 호출 모니터링

API 호출의 성능과 상태를 추적합니다.

```javascript
import { monitorApiCall } from './utils/monitoring'

const startTime = performance.now()
try {
  const response = await fetch('/api/projects')
  const duration = performance.now() - startTime
  monitorApiCall('/api/projects', 'GET', duration, response.status)
} catch (error) {
  const duration = performance.now() - startTime
  monitorApiCall('/api/projects', 'GET', duration, 0, error)
}
```

### 5. 트랜잭션 모니터링

블록체인 트랜잭션을 추적합니다.

```javascript
import { monitorTransaction } from './utils/monitoring'

monitorTransaction({
  network: 'ethereum',
  txHash: '0x...',
  amount: '1.5',
  currency: 'ETH',
  status: 'pending'
})
```

### 6. 결제 모니터링

결제 프로세스를 추적합니다.

```javascript
import { monitorPayment } from './utils/monitoring'

monitorPayment({
  amount: 100,
  currency: 'USD',
  method: 'stripe',
  status: 'success',
  paymentId: 'pi_...'
})
```

## 데이터 저장

### 메모리 저장

모니터링 데이터는 메모리에 저장되며, 최대 100개 항목까지 보관됩니다.

### 로컬 스토리지 백업

백엔드 전송 실패 시 로컬 스토리지에 백업됩니다 (최대 50개).

### 백엔드 전송

프로덕션 환경에서 자동으로 백엔드 API로 전송됩니다.

## Google Analytics 통합

모든 모니터링 이벤트는 Google Analytics에도 자동으로 전송됩니다.

## 모니터링 데이터 조회

```javascript
import { getMonitoringData } from './utils/monitoring'

const data = getMonitoringData()
console.log('Errors:', data.errors)
console.log('Performance:', data.performance)
console.log('User Actions:', data.userActions)
console.log('API Calls:', data.apiCalls)
```

## 데이터 초기화

```javascript
import { clearMonitoringData } from './utils/monitoring'

clearMonitoringData()
```

## 실패한 데이터 재전송

```javascript
import { retryFailedMonitoring } from './utils/monitoring'

// 수동으로 재전송
retryFailedMonitoring()
```

시스템은 자동으로 5분마다 재전송을 시도합니다.

## 백엔드 API 엔드포인트

모니터링 데이터는 다음 엔드포인트로 전송됩니다:

```
POST /api/monitoring
Content-Type: application/json

{
  "type": "error" | "performance" | "user_action" | "api_call" | "transaction" | "payment",
  "data": { ... }
}
```

## Supabase Edge Function 예시

```typescript
// supabase/functions/monitoring/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { type, data } = await req.json()
  
  // Supabase에 저장
  const { error } = await supabase
    .from('monitoring_logs')
    .insert({
      type,
      data,
      created_at: new Date().toISOString()
    })
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## 모니터링 대시보드

모니터링 데이터는 `/status` 페이지에서 확인할 수 있습니다 (향후 구현 예정).

## 주의사항

1. 프로덕션 환경에서만 백엔드 전송이 활성화됩니다.
2. 민감한 정보(비밀번호, 개인정보 등)는 모니터링하지 않습니다.
3. 로컬 스토리지에는 최대 50개 항목만 저장됩니다.
4. 메모리에는 최대 100개 항목만 저장됩니다.

