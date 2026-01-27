# Global Busan XYZ Investment Platform - Monorepo

모노레포 구조로 관리되는 Global Busan XYZ 투자 플랫폼입니다.

## 📂 프로젝트 구조

```
globalbusan/
├── frontend/              # 사용자 프론트엔드 (포트: 3000)
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/               # Backend API (포트: 5000)
│   ├── src/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
├── frontend-admin/        # 관리자 대시보드 (포트: 3001)
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
├── contract/              # Sui 스마트 계약
│   └── sources/
├── doc/                   # 문서
├── package.json           # 루트 package.json (통합 스크립트)
└── README.md
```

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
# 모든 프로젝트의 의존성 한번에 설치
npm run install:all
```

### 2. 개발 서버 실행

#### 모든 서비스 동시 실행
```bash
npm run dev
```

이 명령어는 다음 세 서비스를 동시에 실행합니다:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin Dashboard: http://localhost:3001

#### 개별 서비스 실행
```bash
# 프론트엔드만 실행
npm run dev:frontend

# 백엔드만 실행
npm run dev:backend

# 관리자 대시보드만 실행
npm run dev:admin
```

### 3. 프로덕션 빌드

**⚠️ 중요**: 배포 시에는 각 프로젝트 폴더에서 **독립적으로** 빌드하세요!

```bash
# 로컬 테스트용 (루트에서 일괄 빌드)
npm run build

# 실제 배포용 (각 프로젝트별로 독립 빌드 - 권장!)
cd frontend && npm run build        # Frontend 빌드
cd backend && npm run build         # Backend 빌드 (없음)
cd frontend-admin && npm run build  # Admin 빌드
```

**배포 시 각 폴더별로 빌드하는 이유**:
- 빌드 오류 발생 시 해당 프로젝트만 수정 가능
- 독립적인 의존성 관리
- CI/CD에서 각 프로젝트별 캐싱 가능
- 한 프로젝트 오류가 다른 프로젝트에 영향 없음

## 📦 각 프로젝트 설명

### Frontend (사용자 웹앱)
- **포트**: 3000
- **기술**: React 18.3.1 + Vite + Tailwind CSS
- **기능**: 기부, 투자, 프로젝트 조회, 거래 기록
- **Sui 지갑 연동**: @mysten/sui.js

### Backend (API 서버)
- **포트**: 5000
- **기술**: Node.js + Express.js
- **기능**: RESTful API, Supabase 연동, Sui 거래 검증
- **엔드포인트**:
  - `/api/donations` - 기부 관리
  - `/api/investments` - 투자 관리
  - `/api/projects` - 프로젝트 관리
  - `/api/stats` - 통계 데이터

### Frontend-Admin (관리자 대시보드)
- **포트**: 3001
- **기술**: React 18.3.1 + Vite + Tailwind CSS
- **기능**: 대시보드, 기부/투자 관리, 프로젝트 관리, 사용자 관리
- **로그인**: admin / admin123 (데모)

## 🔧 주요 명령어

```bash
# 개발
npm run dev                 # 모든 서비스 동시 실행
npm run dev:frontend        # 프론트엔드만
npm run dev:backend         # 백엔드만
npm run dev:admin           # 관리자 대시보드만

# 빌드
npm run build               # 전체 빌드
npm run build:frontend      # 프론트엔드 빌드
npm run build:admin         # 관리자 빌드

# 테스트
npm run test                # 프론트엔드 테스트 실행
npm run test:frontend       # 프론트엔드 테스트

# 린트
npm run lint                # 전체 린트
npm run lint:frontend       # 프론트엔드 린트
npm run lint:admin          # 관리자 린트

# 배포
npm run deploy              # 전체 배포
npm run deploy:frontend     # 프론트엔드 배포
npm run deploy:admin        # 관리자 배포

# 정리
npm run clean               # node_modules 및 dist 삭제
```

## 🌐 환경 변수 설정

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_SUI_PACKAGE_ID=0xa97fe...
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

### Frontend-Admin (기본 설정 사용)
Vite 프록시를 통해 Backend API에 연결

## 📱 API 흐름

```
[Frontend] ←→ [Backend API] ←→ [Supabase Database]
                    ↓
              [Sui Blockchain]

[Admin Dashboard] ←→ [Backend API]
```

## 🔐 보안

- **Backend**: Helmet, CORS, Rate Limiting 적용
- **Frontend**: Sui Wallet 서명 필수
- **Admin**: 인증 토큰 기반 접근 제어

## 📊 데이터 흐름

1. **기부/투자 생성**:
   - Frontend에서 Sui Wallet으로 거래 서명
   - 거래 해시를 Backend로 전송
   - Backend에서 Sui 블록체인 검증
   - 검증 성공 시 Supabase에 저장

2. **데이터 조회**:
   - Frontend에서 Backend API 호출
   - Backend가 Supabase에서 데이터 조회
   - Frontend에 JSON 응답 반환

## 🚀 배포

**⚠️ 배포는 반드시 각 프로젝트 폴더에서 독립적으로 진행하세요!**

### Vercel (Frontend + Admin)
```bash
# Frontend 배포
cd frontend
vercel --prod

# Admin 배포
cd frontend-admin
vercel --prod
```

### Heroku (Backend)
```bash
cd backend
git init
heroku create globalbusan-backend
git push heroku main
```

### GitHub Actions (자동 배포)
`main` 브랜치에 push하면 각 프로젝트가 **독립적으로** 빌드/배포됩니다:
- ✅ Frontend → 독립 job → Vercel
- ✅ Backend → 독립 job → Heroku  
- ✅ Admin → 독립 job → Vercel

**장점**:
- 각 프로젝트의 빌드 오류가 서로 영향을 주지 않음
- 빌드 실패 시 해당 프로젝트만 재배포 가능
- 각 프로젝트의 캐시를 독립적으로 관리

## 📝 개발 워크플로우

1. **새 기능 개발**:
   ```bash
   git checkout -b feature/new-feature
   npm run dev  # 개발 서버 실행
   # 코드 작성...
   npm run test  # 테스트
   npm run lint  # 린트 검사
   git commit -m "feat: Add new feature"
   git push origin feature/new-feature
   ```

2. **프로덕션 배포**:
   ```bash
   git checkout main
   npm run build  # 빌드
   npm run deploy  # 배포
   ```

## 🤝 기여

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 라이선스

MIT License

## 📞 지원

- **Frontend 문서**: [frontend/README.md](./frontend/README.md)
- **Backend 문서**: [backend/README.md](./backend/README.md)
- **Admin 문서**: [frontend-admin/README.md](./frontend-admin/README.md)
- **Sui 통합 가이드**: [doc/SUI_BLOCKCHAIN_INTEGRATION.md](./doc/SUI_BLOCKCHAIN_INTEGRATION.md)

---

**버전**: 1.0.0  
**최종 업데이트**: 2026-01-27
