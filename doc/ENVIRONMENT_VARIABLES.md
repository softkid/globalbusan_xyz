# 환경 변수 설정 가이드

이 문서는 Global BUSAN 프로젝트의 환경 변수 설정 방법을 안내합니다.

## 1. 환경 변수 목록

### 1.1 필수 환경 변수

#### Supabase
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Google OAuth
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 1.2 선택적 환경 변수

#### 블록체인 RPC
```env
# Ethereum
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
VITE_ETH_DONATION_CONTRACT=0x...

# Polygon
VITE_POLYGON_RPC_URL=https://polygon-rpc.com
VITE_POLYGON_DONATION_CONTRACT=0x...

# Solana
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_SOL_DONATION_PROGRAM=...
```

#### 결제
```env
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Coinbase Commerce
VITE_COINBASE_COMMERCE_API_KEY=your-api-key
```

#### Google Analytics
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 2. 개발 환경 설정

### 2.1 .env 파일 생성

프로젝트 루트에 `.env` 파일 생성:

```bash
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 2.2 .env.example 파일

`.env.example` 파일을 생성하여 필요한 환경 변수 목록 제공:

```bash
# .env.example
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_CLIENT_ID=
VITE_ETHEREUM_RPC_URL=
VITE_POLYGON_RPC_URL=
VITE_SOLANA_RPC_URL=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_COINBASE_COMMERCE_API_KEY=
VITE_GA_MEASUREMENT_ID=
```

## 3. 프로덕션 환경 설정

### 3.1 Cloudflare Pages

1. Cloudflare Pages 대시보드 접속
2. 프로젝트 선택
3. **Settings > Environment Variables** 이동
4. 환경 변수 추가:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
   - Environment: Production (또는 Preview)

### 3.2 Vercel

1. Vercel 대시보드 접속
2. 프로젝트 선택
3. **Settings > Environment Variables** 이동
4. 환경 변수 추가

### 3.3 Netlify

1. Netlify 대시보드 접속
2. 프로젝트 선택
3. **Site settings > Environment variables** 이동
4. 환경 변수 추가

## 4. 환경별 설정

### 4.1 개발 환경 (.env.development)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-dev-client-id
VITE_ETHEREUM_RPC_URL=https://goerli.infura.io/v3/YOUR_PROJECT_ID
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4.2 프로덕션 환경 (.env.production)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-prod-client-id
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 5. 보안 고려사항

### 5.1 민감한 정보 보호

- ✅ `.env` 파일을 `.gitignore`에 추가
- ✅ 환경 변수는 배포 플랫폼에서만 설정
- ✅ `VITE_` 접두사가 붙은 변수는 클라이언트에 노출됨 (주의)
- ❌ 비밀키나 API 키를 `VITE_` 접두사로 시작하는 변수에 저장하지 않기

### 5.2 안전한 환경 변수

다음 변수들은 클라이언트에 노출되어도 안전합니다:
- `VITE_SUPABASE_ANON_KEY` (RLS로 보호됨)
- `VITE_STRIPE_PUBLISHABLE_KEY` (공개 키)
- `VITE_GOOGLE_CLIENT_ID` (공개 키)

### 5.3 민감한 정보는 서버에서 처리

다음 정보는 서버(Edge Functions)에서만 사용:
- Stripe Secret Key
- Coinbase Commerce Secret Key
- Supabase Service Role Key
- Google OAuth Client Secret

## 6. 환경 변수 사용

### 6.1 코드에서 사용

```javascript
// Vite 환경 변수 사용
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 기본값 설정
const rpcUrl = import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/default'
```

### 6.2 타입 체크 (TypeScript 사용 시)

```typescript
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  // ...
}
```

## 7. 환경 변수 확인

### 7.1 개발 서버 실행 시 확인

```bash
npm run dev
# 콘솔에서 환경 변수 확인 가능
```

### 7.2 빌드 시 확인

```bash
npm run build
# 빌드된 파일에서 환경 변수 확인
```

## 8. 문제 해결

### 8.1 환경 변수가 undefined인 경우

1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 이름이 `VITE_`로 시작하는지 확인
3. 개발 서버를 재시작

### 8.2 프로덕션에서 환경 변수가 적용되지 않는 경우

1. 배포 플랫폼에서 환경 변수 설정 확인
2. 빌드 후 재배포
3. 환경 변수 이름 확인 (대소문자 구분)

## 9. 체크리스트

- [ ] `.env.example` 파일 생성
- [ ] `.env` 파일을 `.gitignore`에 추가
- [ ] 개발 환경 변수 설정
- [ ] 프로덕션 환경 변수 설정
- [ ] 환경 변수 사용 코드 검증
- [ ] 보안 검토 완료

---

**마지막 업데이트**: 2025-12-13

