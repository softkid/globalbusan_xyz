# 토스페이먼츠 결제 통합 가이드

한국에서 사용 가능한 토스페이먼츠 결제 시스템 통합 가이드입니다.

## 개요

토스페이먼츠는 한국에서 가장 널리 사용되는 결제 대행 서비스(PG)입니다. Stripe가 한국에서 사용할 수 없는 대안으로 통합되었습니다.

### 지원 결제수단
- 신용/체크카드
- 계좌이체
- 가상계좌
- 간편결제 (네이버페이, 카카오페이 등)
- 휴대폰 결제

## 설정 방법

### 1. 토스페이먼츠 계정 생성

1. [토스페이먼츠](https://www.tosspayments.com/) 접속
2. 회원가입 및 상점 등록
3. 전자결제 계약 완료 (테스트 모드로 시작 가능)

### 2. API 키 발급

1. 토스페이먼츠 개발자센터 로그인
2. **API 키** 메뉴로 이동
3. **API 개별 연동 키** 확인
   - 클라이언트 키 (Client Key)
   - 시크릿 키 (Secret Key)

### 3. 환경 변수 설정

`.env` 파일에 다음 변수를 추가:

```env
# 토스페이먼츠
VITE_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...
```

**프로덕션 환경:**
- Cloudflare Pages 또는 배포 플랫폼의 환경 변수 설정에서 추가
- Supabase Edge Functions의 시크릿 키 설정에서 `TOSS_SECRET_KEY` 추가

### 4. Supabase Edge Function 배포

```bash
# Supabase CLI로 Edge Function 배포
cd supabase/functions
supabase functions deploy approve-toss-payment
```

또는 Supabase Dashboard에서:
1. Edge Functions 메뉴로 이동
2. `approve-toss-payment` 함수 생성
3. `index.ts` 파일 내용 복사
4. 환경 변수에 `TOSS_SECRET_KEY` 설정

## 사용 방법

### 컴포넌트 사용

```jsx
import TossPayment from '../components/TossPayment'

<TossPayment
  amount={10000} // 원 단위
  currency="KRW"
  onSuccess={(result) => {
    console.log('Payment succeeded:', result)
  }}
  onError={(error) => {
    console.error('Payment failed:', error)
  }}
  metadata={{
    name: '홍길동',
    email: 'user@example.com',
    orderName: 'Global BUSAN 기부'
  }}
/>
```

### 결제 흐름

1. **결제 요청**: 사용자가 결제 버튼 클릭
2. **결제창 열기**: 토스페이먼츠 결제창이 열림
3. **결제 인증**: 사용자가 결제수단 선택 및 인증
4. **리다이렉트**: 성공/실패 URL로 이동
5. **결제 승인**: 서버에서 결제 승인 API 호출
6. **완료**: 결제 완료 및 데이터 저장

### 결제 성공 페이지 처리

`/donation/success` 페이지에서 결제 승인을 처리해야 합니다:

```jsx
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { approveTossPayment } from '../components/TossPayment'

function DonationSuccess() {
  const [searchParams] = useSearchParams()
  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  useEffect(() => {
    if (paymentKey && orderId && amount) {
      // 결제 승인
      approveTossPayment(paymentKey, orderId, amount)
        .then((result) => {
          console.log('Payment approved:', result)
          // 성공 처리
        })
        .catch((error) => {
          console.error('Payment approval failed:', error)
          // 에러 처리
        })
    }
  }, [paymentKey, orderId, amount])

  return <div>결제 처리 중...</div>
}
```

## 테스트

### 테스트 키 사용

토스페이먼츠는 테스트 키를 제공합니다:
- 테스트 클라이언트 키: `test_ck_...`
- 테스트 시크릿 키: `test_sk_...`

테스트 결제는 실제로 결제되지 않습니다.

### 테스트 카드 번호

- **성공**: 1234-5678-9012-3456
- **실패**: 1111-1111-1111-1111
- **한도 초과**: 2222-2222-2222-2222

## 주의사항

1. **시크릿 키 보안**
   - 시크릿 키는 절대 클라이언트에 노출되면 안 됩니다
   - 서버(Edge Function)에서만 사용하세요

2. **결제 금액 검증**
   - 클라이언트에서 받은 금액을 서버에서 반드시 검증하세요
   - 금액 조작을 방지하기 위해 `successUrl`의 `amount` 파라미터와 비교하세요

3. **결제 승인 시간**
   - 결제 요청 후 10분 이내에 승인해야 합니다
   - 10분이 지나면 결제가 만료됩니다

4. **주문번호 중복**
   - `orderId`는 고유해야 합니다
   - UUID나 타임스탬프 기반 고유값을 사용하세요

## 에러 처리

### 일반적인 에러

- `UNAUTHORIZED_KEY`: API 키가 잘못되었습니다
- `NOT_FOUND_PAYMENT_SESSION`: 결제 세션을 찾을 수 없습니다 (10분 초과)
- `REJECT_CARD_COMPANY`: 카드사에서 거절했습니다
- `FORBIDDEN_REQUEST`: 요청이 거부되었습니다

### 에러 처리 예시

```jsx
onError={(error) => {
  if (error.code === 'UNAUTHORIZED_KEY') {
    alert('결제 설정 오류입니다. 관리자에게 문의하세요.')
  } else if (error.code === 'REJECT_CARD_COMPANY') {
    alert('카드 결제가 거절되었습니다. 다른 카드를 시도해주세요.')
  } else {
    alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}}
```

## 참고 자료

- [토스페이먼츠 개발자센터](https://docs.tosspayments.com/)
- [결제창 연동 가이드](https://docs.tosspayments.com/guides/v2/payment-window/integration)
- [API 레퍼런스](https://docs.tosspayments.com/reference)
- [에러 코드](https://docs.tosspayments.com/reference/error-codes)

---

**마지막 업데이트**: 2025-12-13

