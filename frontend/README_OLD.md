# Global BUSAN

투명한 블록체인 기반 플랫폼을 구축하여 국제 기업가들과 한국의 비즈니스 생태계를 연결합니다. 함께 부산에 글로벌 비즈니스 허브를 만들어갑시다.

## 🌟 주요 기능

- **투명한 기부 시스템**: 블록체인 기반 기부 추적 및 검증
- **실시간 지분 구조**: 실시간 기부금 집계 및 기부자 시각화
- **분기별 보고서**: 투명한 재무 보고서 및 프로젝트 진행 상황
- **다국어 지원**: 한국어, 영어, 일본어, 중국어, 아랍어 지원
- **다중 결제 수단**: 암호화폐 (ETH, BTC, SOL, MATIC), 카드 결제 (Stripe), 한국 결제 (토스페이먼츠), PayPal
- **PWA 지원**: 오프라인 지원 및 모바일 앱 경험

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- Supabase 계정
- Google OAuth 클라이언트 ID (선택사항)

### 설치

```bash
# 저장소 클론
git clone https://github.com/softkid/globalbusan_xyz.git
cd globalbusan_xyz

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 필요한 환경 변수 설정
```

### 환경 변수 설정

`.env` 파일에 다음 변수들을 설정하세요:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Blockchain RPC
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_POLYGON_RPC_URL=https://polygon-rpc.com

# Payment
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_COINBASE_COMMERCE_API_KEY=your_coinbase_api_key
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 📁 프로젝트 구조

```
globalbusan_xyz/
├── public/                 # 정적 파일
│   ├── sitemap.xml        # 사이트맵
│   ├── robots.txt         # 검색 엔진 설정
│   ├── manifest.json      # PWA 매니페스트
│   └── sw.js             # Service Worker
├── src/
│   ├── components/        # React 컴포넌트
│   │   ├── __tests__/    # 컴포넌트 테스트
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   └── ...
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── Home.jsx
│   │   ├── Invest.jsx
│   │   ├── Projects.jsx
│   │   └── ...
│   ├── lib/              # 유틸리티 및 서비스
│   │   ├── supabase.js  # Supabase 클라이언트
│   │   ├── blockchain.js # 블록체인 유틸리티
│   │   ├── payment.js   # 결제 유틸리티
│   │   └── ...
│   ├── hooks/           # 커스텀 훅
│   │   ├── useLazyLoad.js
│   │   └── useKeyboardNavigation.js
│   ├── utils/           # 유틸리티 함수
│   │   ├── errorHandler.js
│   │   ├── serviceWorker.js
│   │   └── webVitals.js
│   ├── i18n/            # 다국어 설정
│   └── App.jsx          # 메인 앱 컴포넌트
├── supabase/
│   └── functions/       # Supabase Edge Functions
│       ├── create-payment-intent/
│       ├── verify-payment/
│       └── process-refund/
├── doc/                 # 문서
│   ├── Implementation_Checklist.md
│   ├── PRD_GlobalBusan_XYZ.md
│   ├── GOOGLE_SEARCH_CONSOLE_SETUP.md
│   ├── SMART_CONTRACT_DEPLOYMENT.md
│   └── UAT_CHECKLIST.md
└── package.json
```

## 🧪 테스트

```bash
# 모든 테스트 실행
npm test

# 커버리지 포함 테스트
npm run test:coverage

# 감시 모드
npm run test:watch
```

## 📚 문서

- [구현 체크리스트](./doc/Implementation_Checklist.md)
- [배포 가이드](./doc/DEPLOYMENT_GUIDE.md) ⭐ 새로 추가
- [프로젝트 요약](./doc/PROJECT_SUMMARY.md)
- [Google Search Console 설정 가이드](./doc/GOOGLE_SEARCH_CONSOLE_SETUP.md)
- [스마트 컨트랙트 배포 가이드](./doc/SMART_CONTRACT_DEPLOYMENT.md)
- [사용자 수용 테스트 체크리스트](./doc/UAT_CHECKLIST.md)
- [이미지 최적화 가이드](./doc/IMAGE_OPTIMIZATION_GUIDE.md)
- [Supabase Auth 통합 가이드](./doc/SUPABASE_AUTH_GUIDE.md)
- [환경 변수 설정 가이드](./doc/ENVIRONMENT_VARIABLES.md)
- [토스페이먼츠 설정 가이드](./doc/TOSS_PAYMENTS_SETUP.md) ⭐ 한국 결제 대안
- [PayPal 설정 가이드](./doc/PAYPAL_SETUP.md) ⭐ 전 세계 결제
- [모니터링 가이드](./doc/MONITORING_GUIDE.md)

## 🛠 기술 스택

### 프론트엔드
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **GSAP** - 애니메이션
- **React Router** - 라우팅
- **i18next** - 다국어 지원

### 백엔드
- **Supabase** - BaaS (Database, Auth, Storage)
- **Supabase Edge Functions** - 서버리스 함수

### 블록체인
- **Ethers.js** - Ethereum/Polygon
- **@solana/web3.js** - Solana
- **MetaMask** - Ethereum 지갑
- **Phantom** - Solana 지갑

### 결제
- **Stripe** - 카드 결제 (해외)
- **토스페이먼츠** - 카드/간편결제 (한국)
- **PayPal** - PayPal 결제 (전 세계)
- **Coinbase Commerce** - 암호화폐 결제

### 테스트
- **Jest** - 테스트 프레임워크
- **React Testing Library** - 컴포넌트 테스트

## 🚢 배포

### Cloudflare Pages

1. GitHub 저장소 연결
2. 빌드 설정:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. 환경 변수 설정
4. 배포

### 환경 변수 (프로덕션)

Cloudflare Pages 대시보드에서 다음 환경 변수 설정:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ETHEREUM_RPC_URL`
- `VITE_SOLANA_RPC_URL`
- `VITE_POLYGON_RPC_URL`
- `VITE_STRIPE_PUBLISHABLE_KEY`

## 📊 현재 상태

- **버전**: 0.1.0-beta
- **진행률**: 약 99.9%
- **완료된 항목**: 155개
- **미완료 항목**: 2개 (Stripe 계정 설정, 블록체인 이벤트 리스닝)
- **테스트 커버리지**: 약 80% (목표 달성)

자세한 내용은 [구현 체크리스트](./doc/Implementation_Checklist.md)를 참조하세요.

### 주요 완료 사항
- ✅ SEO 최적화 (sitemap.xml, robots.txt, 구조화된 데이터)
- ✅ 결제 시스템 통합 (Stripe, Coinbase Commerce)
- ✅ 블록체인 통합 (Ethereum, Solana, Polygon)
- ✅ 테스트 인프라 (단위, 통합, 컴포넌트 테스트)
- ✅ 성능 최적화 (코드 스플리팅, lazy loading, Service Worker)
- ✅ 에러 핸들링 (ErrorBoundary, 전역 에러 핸들러)
- ✅ 접근성 개선 (ARIA, 키보드 네비게이션)
- ✅ 성능 모니터링 (Web Vitals)
- ✅ 문서화 완료

## 🤝 기여

기여를 환영합니다! 이슈를 열거나 Pull Request를 제출해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 📞 연락처

- **이메일**: contact@globalbusan.xyz
- **웹사이트**: https://globalbusan.xyz

---

**Made with ❤️ for Busan**
