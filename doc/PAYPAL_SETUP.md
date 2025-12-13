# PayPal 결제 통합 가이드

전 세계에서 사용 가능한 PayPal 결제 시스템 통합 가이드입니다.

## 개요

PayPal은 전 세계적으로 가장 널리 사용되는 온라인 결제 시스템 중 하나입니다. PayPal 계정 또는 신용/체크카드로 결제할 수 있습니다.

### 지원 결제 수단
- PayPal 계정
- 신용/체크카드 (PayPal을 통한 처리)
- 다양한 통화 (USD, EUR, GBP 등)

## 설정 방법

### 1. PayPal 계정 생성

1. [PayPal Developer](https://developer.paypal.com/) 접속
2. 계정 생성 및 로그인
3. **My Apps & Credentials** 메뉴로 이동
4. **Create App** 클릭
5. 앱 이름 입력 및 Sandbox/Live 선택
6. Client ID와 Secret 생성

### 2. API 키 발급

PayPal Developer Dashboard에서:
- **Client ID**: 클라이언트 측에서 사용
- **Secret**: 서버 측에서만 사용 (절대 노출 금지)

**제공받은 키:**
- Client ID: `AdkDtguiC4R_Dvjht56uHr2p6xwBEOR7j9mV5zCwegXhWVav0l8CKak5NWQl-XZTsy3NbRe9TXYvFZeJ`
- Secret: `EK1drDAKwsHj4aI3nYqIQFhpeXD99dvfKDRNfjzkYLw4tr1KcKViZubAjatNYcyrSSWG7UC6M-dx-chD`

### 3. 환경 변수 설정

`.env` 파일에 다음 변수를 추가:

```env
# PayPal
VITE_PAYPAL_CLIENT_ID=AdkDtguiC4R_Dvjht56uHr2p6xwBEOR7j9mV5zCwegXhWVav0l8CKak5NWQl-XZTsy3NbRe9TXYvFZeJ
PAYPAL_SECRET=EK1drDAKwsHj4aI3nYqIQFhpeXD99dvfKDRNfjzkYLw4tr1KcKViZubAjatNYcyrSSWG7UC6M-dx-chD
PAYPAL_MODE=sandbox  # 또는 'live' (프로덕션)
```

**프로덕션 환경:**
- Cloudflare Pages 또는 배포 플랫폼의 환경 변수 설정에서 추가
- Supabase Edge Functions의 시크릿 키 설정에서 `PAYPAL_SECRET`과 `PAYPAL_MODE` 추가

### 4. Supabase Edge Function 배포

```bash
# Supabase CLI로 Edge Function 배포
cd supabase/functions
supabase functions deploy create-paypal-order
supabase functions deploy approve-paypal-order
```

또는 Supabase Dashboard에서:
1. Edge Functions 메뉴로 이동
2. `create-paypal-order` 함수 생성
3. `index.ts` 파일 내용 복사
4. 환경 변수에 `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `PAYPAL_MODE` 설정
5. `approve-paypal-order` 함수도 동일하게 설정

## 사용 방법

### 컴포넌트 사용

```jsx
import PayPalPayment from '../components/PayPalPayment'

<PayPalPayment
  amount={10.00} // USD 단위
  currency="USD"
  onSuccess={(result) => {
    console.log('Payment succeeded:', result)
  }}
  onError={(error) => {
    console.error('Payment failed:', error)
  }}
  metadata={{
    name: 'John Doe',
    email: 'user@example.com',
    orderName: 'Global BUSAN Donation'
  }}
/>
```

### 결제 흐름

1. **Order 생성**: 사용자가 PayPal 버튼 클릭
2. **PayPal 인증**: PayPal 로그인 및 결제 승인
3. **Order 승인**: 서버에서 Order Capture
4. **완료**: 결제 완료 및 데이터 저장

## 테스트

### Sandbox 계정 사용

PayPal Sandbox 환경에서 테스트:
1. PayPal Developer Dashboard에서 Sandbox 계정 생성
2. Sandbox 계정으로 로그인하여 테스트 결제 진행
3. 실제로 결제되지 않습니다

### 테스트 계정

PayPal Sandbox에서 제공하는 테스트 계정을 사용할 수 있습니다:
- 구매자 계정: `sb-buyer@business.example.com`
- 판매자 계정: `sb-seller@business.example.com`

## 주의사항

1. **Secret 키 보안**
   - Secret 키는 절대 클라이언트에 노출되면 안 됩니다
   - 서버(Edge Function)에서만 사용하세요

2. **결제 금액 검증**
   - 클라이언트에서 받은 금액을 서버에서 반드시 검증하세요
   - Order 생성 시 금액과 Capture 시 금액이 일치하는지 확인하세요

3. **환불 처리**
   - PayPal 환불은 PayPal Dashboard에서 수동으로 처리하거나
   - PayPal Refund API를 사용하여 자동화할 수 있습니다

4. **환경 설정**
   - Sandbox: 테스트 환경 (실제 결제 안 됨)
   - Live: 프로덕션 환경 (실제 결제)

## 에러 처리

### 일반적인 에러

- `INVALID_CLIENT_ID`: Client ID가 잘못되었습니다
- `UNAUTHORIZED`: Secret 키가 잘못되었습니다
- `INSUFFICIENT_FUNDS`: 계정 잔액 부족
- `PAYER_ACTION_REQUIRED`: 구매자 추가 인증 필요

### 에러 처리 예시

```jsx
onError={(error) => {
  if (error.message.includes('INVALID_CLIENT_ID')) {
    alert('PayPal 설정 오류입니다. 관리자에게 문의하세요.')
  } else if (error.message.includes('INSUFFICIENT_FUNDS')) {
    alert('계정 잔액이 부족합니다.')
  } else {
    alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}}
```

## 참고 자료

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Orders API](https://developer.paypal.com/docs/api/orders/v2/)
- [PayPal React SDK](https://github.com/paypal/react-paypal-js)
- [PayPal Integration Guide](https://developer.paypal.com/docs/checkout/)

---

**마지막 업데이트**: 2025-12-13

