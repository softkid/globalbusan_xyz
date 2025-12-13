# Global BUSAN 배포 가이드

이 문서는 Global BUSAN 프로젝트를 프로덕션 환경에 배포하는 방법을 안내합니다.

## 📋 사전 준비사항

### 필수 계정
- [ ] GitHub 계정
- [ ] Supabase 계정
- [ ] Cloudflare 계정 (또는 다른 호스팅 서비스)
- [ ] Stripe 계정 (카드 결제 사용 시)
- [ ] Coinbase Commerce 계정 (암호화폐 결제 사용 시)
- [ ] Google Cloud Console 계정 (OAuth 사용 시)

### 필수 환경 변수
모든 환경 변수는 `.env` 파일과 배포 플랫폼에 설정해야 합니다.

## 🚀 배포 단계

### 1. GitHub 저장소 설정

```bash
# 저장소 클론
git clone https://github.com/softkid/globalbusan_xyz.git
cd globalbusan_xyz

# 의존성 설치
npm install

# 환경 변수 파일 생성
cp .env.example .env
```

### 2. Supabase 설정

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 새 프로젝트 생성
3. 데이터베이스 스키마 설정 (SQL 스크립트 실행)
4. Storage 버킷 생성
5. Edge Functions 배포
6. 환경 변수 설정:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 3. Supabase Edge Functions 배포

```bash
# Supabase CLI 설치 (필요시)
npm install -g supabase

# 로그인
supabase login

# Edge Functions 배포
cd supabase/functions
supabase functions deploy create-coinbase-charge
supabase functions deploy check-coinbase-charge
supabase functions deploy verify-payment
supabase functions deploy check-payment-intent
supabase functions deploy monitoring-webhook
```

### 4. Cloudflare Pages 배포

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. Pages 섹션으로 이동
3. "Create a project" 클릭
4. GitHub 저장소 연결
5. 빌드 설정:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: `18` 또는 `20`
6. 환경 변수 설정 (아래 참조)
7. 배포 시작

### 5. 환경 변수 설정 (Cloudflare Pages)

Cloudflare Pages 대시보드에서 다음 환경 변수를 설정:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Blockchain RPC
VITE_ETHEREUM_RPC_URL=https://eth.llamarpc.com
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_POLYGON_RPC_URL=https://polygon-rpc.com

# Payment
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_COINBASE_COMMERCE_API_KEY=your-coinbase-api-key

# Google Analytics (선택사항)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 6. 도메인 연결 (선택사항)

1. Cloudflare Pages 대시보드에서 프로젝트 선택
2. "Custom domains" 섹션으로 이동
3. 도메인 추가
4. DNS 레코드 설정 (Cloudflare가 자동으로 제공)

### 7. SSL 인증서

Cloudflare Pages는 자동으로 SSL 인증서를 제공합니다. 추가 설정이 필요하지 않습니다.

## 🔍 배포 후 검증

### 1. 기본 기능 테스트

- [ ] 홈페이지 로드 확인
- [ ] 네비게이션 작동 확인
- [ ] 다국어 전환 확인
- [ ] 반응형 디자인 확인

### 2. 데이터베이스 연결 확인

- [ ] Supabase 연결 상태 확인
- [ ] 데이터 로드 확인
- [ ] 실시간 업데이트 확인

### 3. 결제 시스템 테스트

- [ ] Stripe 테스트 모드 결제 테스트
- [ ] Coinbase Commerce 결제 플로우 테스트
- [ ] 결제 완료 후 데이터 저장 확인

### 4. 블록체인 통합 테스트

- [ ] 지갑 연결 테스트
- [ ] 트랜잭션 전송 테스트 (테스트넷)
- [ ] 트랜잭션 검증 확인

### 5. 성능 확인

- [ ] 페이지 로드 속도 확인 (Lighthouse)
- [ ] Core Web Vitals 확인
- [ ] 모바일 성능 확인

## 📊 모니터링 설정

### Google Analytics

1. Google Analytics 계정 생성
2. 측정 ID 발급
3. 환경 변수에 `VITE_GA_MEASUREMENT_ID` 설정
4. 데이터 수집 확인

### Google Search Console

1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 추가 (도메인 또는 URL 접두어)
3. 소유권 확인
4. sitemap.xml 제출

### 에러 모니터링

통합 모니터링 시스템이 자동으로 에러를 추적합니다:
- 에러 로깅
- 성능 모니터링
- 사용자 액션 추적
- API 호출 모니터링

## 🔧 문제 해결

### 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 문제 확인
npm install --legacy-peer-deps

# 캐시 클리어
rm -rf node_modules package-lock.json
npm install
```

### 환경 변수 문제

- Cloudflare Pages에서 환경 변수가 제대로 설정되었는지 확인
- 빌드 로그에서 환경 변수 로드 확인
- `.env` 파일이 `.gitignore`에 포함되어 있는지 확인

### Supabase 연결 문제

- Supabase 프로젝트가 활성화되어 있는지 확인
- RLS (Row Level Security) 정책 확인
- API 키가 올바른지 확인

## 📝 배포 체크리스트

### 배포 전
- [ ] 모든 테스트 통과
- [ ] 환경 변수 설정 완료
- [ ] Supabase Edge Functions 배포 완료
- [ ] 빌드 성공 확인
- [ ] 로컬에서 프로덕션 빌드 테스트

### 배포 후
- [ ] 기본 기능 작동 확인
- [ ] 데이터베이스 연결 확인
- [ ] 결제 시스템 테스트
- [ ] 모니터링 설정 확인
- [ ] 성능 확인

## 🔐 보안 고려사항

1. **환경 변수 보호**
   - 민감한 정보는 환경 변수로만 관리
   - `.env` 파일을 Git에 커밋하지 않음

2. **API 키 관리**
   - 프로덕션과 개발 환경의 키 분리
   - 정기적인 키 로테이션

3. **RLS 정책**
   - Supabase RLS 정책 설정
   - 필요한 권한만 부여

4. **HTTPS 강제**
   - 모든 통신은 HTTPS 사용
   - Cloudflare Pages는 자동으로 HTTPS 제공

## 📚 추가 자료

- [구현 체크리스트](./Implementation_Checklist.md)
- [환경 변수 설정 가이드](./ENVIRONMENT_VARIABLES.md)
- [Supabase Auth 통합 가이드](./SUPABASE_AUTH_GUIDE.md)
- [모니터링 가이드](./MONITORING_GUIDE.md)

---

**마지막 업데이트**: 2025-12-13

