# 모노레포 구조 변경 완료 보고서

## 📋 변경 개요

프로젝트를 모노레포(Monorepo) 구조로 재구성하였습니다. 각 서비스를 독립적으로 개발하고 빌드할 수 있으며, 루트에서 일괄 관리 및 배포가 가능합니다.

## 📂 새로운 프로젝트 구조

```
globalbusan-monorepo/
│
├── frontend/                      # 사용자 웹 애플리케이션
│   ├── src/                       # React 소스 코드
│   ├── public/                    # 정적 파일
│   ├── package.json               # Frontend 의존성
│   └── vite.config.js             # Vite 설정
│
├── backend/                       # Backend API 서버
│   ├── src/
│   │   ├── index.js               # 메인 서버 파일
│   │   └── routes/                # API 라우트
│   │       ├── donation.js        # 기부 API
│   │       ├── investment.js      # 투자 API
│   │       ├── project.js         # 프로젝트 API
│   │       ├── stats.js           # 통계 API
│   │       └── auth.js            # 인증 API
│   ├── package.json               # Backend 의존성
│   └── README.md                  # Backend 문서
│
├── frontend-admin/                # 관리자 대시보드
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.jsx        # 사이드바 네비게이션
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # 대시보드
│   │   │   ├── Donations.jsx      # 기부 관리
│   │   │   ├── Investments.jsx    # 투자 관리
│   │   │   ├── Projects.jsx       # 프로젝트 관리
│   │   │   ├── Users.jsx          # 사용자 관리
│   │   │   ├── Settings.jsx       # 설정
│   │   │   └── Login.jsx          # 로그인
│   │   ├── App.jsx                # 메인 앱
│   │   └── main.jsx               # 엔트리 포인트
│   ├── package.json               # Admin 의존성
│   └── vite.config.js             # Vite 설정 (포트 3001)
│
├── contract/                      # Sui 스마트 계약
│   ├── sources/
│   │   ├── donation_pool.move
│   │   └── investment_project.move
│   └── Move.toml
│
├── doc/                           # 프로젝트 문서
│   ├── SUI_BLOCKCHAIN_INTEGRATION.md
│   ├── IMPLEMENTATION_COMPLETE.md
│   ├── MONOREPO_RESTRUCTURE.md    # 이 문서
│   └── ...기타 문서들
│
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions 배포 워크플로우
│
├── package.json                   # 루트 통합 스크립트
├── .gitignore                     # 통합 gitignore
└── README.md                      # 메인 문서
```

## ✅ 완료된 작업

### 1. 폴더 구조 생성 ✅
- `frontend/` - 기존 사용자 웹앱 파일 이동
- `backend/` - 새로운 Backend API 생성
- `frontend-admin/` - 새로운 관리자 대시보드 생성

### 2. Frontend 이동 ✅
다음 파일들이 `frontend/` 폴더로 이동되었습니다:
- `src/` - React 소스 코드
- `public/` - 정적 파일
- `index.html` - 메인 HTML
- `package.json` - 의존성
- `vite.config.js` - Vite 설정
- `tailwind.config.js` - Tailwind 설정
- `postcss.config.js` - PostCSS 설정
- `eslint.config.js` - ESLint 설정
- `jest.config.js` - Jest 설정
- `.env` - 환경 변수
- `node_modules/` - 의존성 패키지
- `scripts/` - 빌드 스크립트

### 3. Backend API 생성 ✅
완전한 RESTful API 서버 구축:
- **Hono 프레임워크** (Cloudflare Workers)
- **보안 미들웨어**: Secure Headers, CORS, Rate Limiting
- **API 라우트**:
  - `/api/donations` - 기부 관리
  - `/api/investments` - 투자 관리
  - `/api/projects` - 프로젝트 조회
  - `/api/stats` - 통계 데이터
  - `/api/auth` - 인증 (준비)
- **Sui 블록체인 검증**: 거래 해시 검증
- **Supabase 연동**: PostgreSQL 데이터베이스

### 4. Frontend-Admin 대시보드 생성 ✅
관리자용 대시보드 구축:
- **React 기반** (포트: 3001)
- **Tailwind CSS** 스타일링
- **페이지**:
  - Dashboard - 통계 개요
  - Donations - 기부 관리
  - Investments - 투자 관리
  - Projects - 프로젝트 관리
  - Users - 사용자 관리
  - Settings - 설정
  - Login - 로그인 (admin/admin123)
- **API 프록시**: Backend API 연동

### 5. 루트 통합 스크립트 ✅
`package.json`에 통합 명령어 추가:
- `npm run dev` - 모든 서비스 동시 실행
- `npm run build` - 전체 빌드
- `npm run deploy` - 일괄 배포
- `npm run test` - 테스트 실행
- `npm run clean` - 정리

### 6. GitHub Actions 배포 ✅
자동화된 CI/CD 파이프라인:
- **빌드**: Frontend, Backend, Admin 각각 빌드
- **테스트**: 자동 테스트 실행
- **배포**:
  - Frontend → Vercel
  - Admin → Vercel
  - Backend → Heroku

## 🚀 사용 방법

### 초기 설정

```bash
# 1. 의존성 설치
npm run install:all
```

### 개발 모드

```bash
# 모든 서비스 동시 실행
npm run dev

# 개별 실행
npm run dev:frontend     # Frontend만 (포트: 3000)
npm run dev:backend      # Backend만 (Cloudflare Workers local dev)
npm run dev:admin        # Admin만 (포트: 3001)
```

### 프로덕션 빌드

**⚠️ 중요: 배포 시에는 각 프로젝트 폴더에서 독립적으로 빌드!**

```bash
# ❌ 로컬 테스트용만 사용 (권장하지 않음)
npm run build  # 루트에서 일괄 빌드

# ✅ 실제 배포 시 사용 (권장!)
cd frontend && npm run build        # Frontend 독립 빌드
cd ../backend && npm run build      # Backend 독립 빌드  
cd ../frontend-admin && npm run build  # Admin 독립 빌드
```

**각 폴더별로 빌드하는 이유**:
1. **빌드 오류 격리**: 한 프로젝트의 오류가 다른 프로젝트에 영향 없음
2. **독립적 수정**: 오류 발생 시 해당 프로젝트만 수정하고 재빌드
3. **CI/CD 최적화**: 각 프로젝트별 캐싱, 병렬 빌드 가능
4. **선택적 배포**: 변경된 프로젝트만 배포 가능

## 🌐 포트 구성

| 서비스 | 포트 | URL |
|--------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend (Workers Dev) | 8787 | http://localhost:8787 |
| Admin Dashboard | 3001 | http://localhost:3001 |

## 📡 API 흐름

```
┌─────────────┐         ┌──────────────────┐         ┌──────────────┐
│  Frontend   │ ←──────→│ Cloudflare Workers│ ←──────→│   Supabase   │
│ (Port 3000) │         │  Hono Backend    │         │  (Database)  │
└─────────────┘         └──────────────────┘         └──────────────┘
                                │
                                ↓
                        ┌──────────────┐
                        │     Sui      │
                        │  Blockchain  │
                        └──────────────┘

┌─────────────┐         ┌──────────────────┐
│   Admin     │ ←──────→│ Cloudflare Workers│
│ (Port 3001) │         │  Hono Backend    │
└─────────────┘         └──────────────────┘
```

## 🔧 환경 변수 설정

### Frontend (.env)
```env
VITE_API_URL=https://globalbusan-backend.workers.dev/api
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_SUI_PACKAGE_ID=0xa97fe...
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

### Backend (Cloudflare Workers Secrets)
로컬 개발: `.dev.vars` 파일 생성
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PACKAGE_ID=0xa97fe...
SUI_DONATION_POOL_ID=0xd1cd...
ENVIRONMENT=development
```

프로덕션: Wrangler secret 명령어 사용
```bash
cd backend
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
wrangler secret put SUI_RPC_URL
wrangler secret put SUI_PACKAGE_ID
wrangler secret put SUI_DONATION_POOL_ID
```

## 📊 프로젝트 통계

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | 3개 (Frontend, Backend, Admin) |
| Backend API 엔드포인트 | 5개 |
| Admin 페이지 | 7개 |
| 통합 스크립트 | 12개 |
| 생성된 파일 | 30+ 개 |

## 🔐 보안 강화

### Backend API (Cloudflare Workers)
- **Secure Headers**: HTTP 헤더 보안
- **CORS**: 크로스 오리진 제어
- **Rate Limiting**: 15분당 100 요청 제한 (Cloudflare IP 기반)
- **Input Validation**: Joi 스키마 검증
- **Transaction Verification**: Sui 블록체인 거래 검증
- **Edge Computing**: Cloudflare 글로벌 네트워크

### Admin Dashboard
- **인증**: 토큰 기반 로그인
- **접근 제어**: 인증된 사용자만 접근
- **API 프록시**: 직접 노출 방지

## 📝 마이그레이션 가이드

### 기존 프로젝트에서 마이그레이션

1. **코드 업데이트**:
   ```bash
   # Frontend에서 API 호출 시
   # 기존: fetch('/api/donations')
   # 변경: fetch('https://globalbusan-backend.workers.dev/api/donations')
   
   # 또는 환경 변수 사용
   fetch(`${import.meta.env.VITE_API_URL}/donations`)
   ```

2. **의존성 재설치**:
   ```bash
   npm run clean
   npm run install:all
   ```

3. **빌드 확인**:
   ```bash
   # Frontend & Admin
   cd frontend && npm run build
   cd ../frontend-admin && npm run build
   
   # Backend (Cloudflare Workers)
   cd ../backend && npm run dev
   ```

## 🚀 배포 설정

### GitHub Actions - 각 프로젝트 독립 배포

`.github/workflows/deploy.yml`에서 각 프로젝트를 **독립적인 job**으로 실행:

```yaml
jobs:
  # Job 1: Frontend 독립 빌드
  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
  
  # Job 2: Backend 독립 빌드
  build-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd backend && npm ci
  
  # Job 3: Admin 독립 빌드
  build-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd frontend-admin && npm ci
      - run: cd frontend-admin && npm run build
  
  # 배포도 각각 독립적으로
  deploy-frontend: ...
  deploy-backend: ...
  deploy-admin: ...
```

**장점**:
- ✅ 각 job이 독립적으로 실행
- ✅ 한 프로젝트 빌드 실패 시 다른 프로젝트는 계속 진행
- ✅ 각 프로젝트의 캐시 독립 관리
- ✅ 병렬 빌드로 시간 단축
- ✅ 빌드 오류 발생 시 해당 job만 재실행

### Vercel (Frontend + Admin)

**각 프로젝트를 별도 Vercel 프로젝트로 배포**:

```bash
# Frontend 배포
cd frontend
vercel --prod

# Admin 배포 (다른 Vercel 프로젝트)
cd frontend-admin
vercel --prod
```

1. **Vercel에서 2개의 프로젝트 생성**:
   - `globalbusan-frontend`
   - `globalbusan-admin`

2. **각각 독립적인 도메인**:
   - Frontend: `globalbusan.vercel.app`
   - Admin: `admin-globalbusan.vercel.app`

3. **GitHub Secrets 설정**:
   ```
   VERCEL_TOKEN
   VERCEL_ORG_ID
   VERCEL_PROJECT_ID          # Frontend용
   VERCEL_ADMIN_PROJECT_ID    # Admin용
   ```

4. **각 프로젝트의 Root Directory 설정**:
   - Frontend: `frontend`
   - Admin: `frontend-admin`

### Heroku (Backend)

```bash
cd backend
heroku create globalbusan-backend
git push heroku main
```

**GitHub Secrets 설정**:
```
HEROKU_API_KEY
HEROKU_APP_NAME
HEROKU_EMAIL
```

## 📖 추가 문서

- **Frontend**: [frontend/README.md](../frontend/README.md)
- **Backend**: [backend/README.md](../backend/README.md)
- **Admin**: [frontend-admin/README.md](../frontend-admin/README.md)
- **Sui 통합**: [SUI_BLOCKCHAIN_INTEGRATION.md](./SUI_BLOCKCHAIN_INTEGRATION.md)
- **구현 완료**: [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)

## 🎯 다음 단계

### 즉시
- [ ] 각 프로젝트의 `.env` 파일 설정
- [ ] Backend API 의존성 설치 및 실행 테스트
- [ ] Admin 대시보드 의존성 설치 및 실행 테스트
- [ ] 모든 서비스 동시 실행 테스트 (`npm run dev`)

### 단기
- [ ] Backend API 테스트 코드 작성
- [ ] Admin 대시보드 완전한 CRUD 기능 구현
- [ ] Vercel 및 Heroku 배포 설정
- [ ] GitHub Secrets 설정

### 중기
- [ ] Admin 대시보드 권한 관리 시스템
- [ ] Backend API 인증 시스템 (JWT)
- [ ] 실시간 알림 기능
- [ ] 데이터 분석 및 리포트

## ⚠️ 주의사항

1. **포트 충돌**: 각 서비스는 다른 포트를 사용합니다.
2. **환경 변수**: 각 프로젝트마다 `.env` 파일이 필요합니다.
3. **의존성**: 각 프로젝트의 `node_modules`는 독립적으로 관리됩니다.
4. **빌드 순서**: Frontend와 Admin은 Backend API를 필요로 할 수 있습니다.

## 🐛 문제 해결

### "Cannot find module" 오류
```bash
# 해당 프로젝트 폴더에서
cd frontend  # 또는 backend, frontend-admin
npm install
```

### 포트 사용 중 오류
```bash
# 프로세스 종료 후 재시작
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS 오류
Backend의 CORS 설정 확인:
```javascript
// backend/src/index.js
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
})
```

---

**변경 완료 일자**: 2026-01-27  
**버전**: 2.0.0 (Monorepo)  
**상태**: ✅ 완료 및 테스트 준비
