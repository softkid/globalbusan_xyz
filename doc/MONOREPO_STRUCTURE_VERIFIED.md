# 🎯 모노레포 구조 최종 확인

## ✅ 올바른 구조 확인 완료

각 프로젝트가 **독립적으로** package.json을 가지고 있으며, 각자의 node_modules와 빌드 설정을 가집니다.

## 📦 패키지 구조

```
globalbusan-monorepo/
│
├── package.json                    # 루트: concurrently만 설치 (29 packages)
│   └── devDependencies:
│       └── concurrently            # 여러 프로세스 동시 실행용
│
├── frontend/
│   ├── package.json                # Frontend 전용 의존성
│   ├── node_modules/               # Frontend 전용 modules
│   └── dist/                       # Frontend 빌드 출력
│
├── backend/
│   ├── package.json                # Backend 전용 의존성
│   ├── node_modules/               # Backend 전용 modules
│   └── (no build output)           # Node.js는 빌드 불필요
│
└── frontend-admin/
    ├── package.json                # Admin 전용 의존성
    ├── node_modules/               # Admin 전용 modules
    └── dist/                       # Admin 빌드 출력
```

## 🔧 빌드 흐름

### 잘못된 방식 (❌)
```bash
# 루트에서 모든 의존성 설치 시도
npm install  # ← 각 프로젝트의 의존성까지 설치하려 함 (에러 발생!)
```

### 올바른 방식 (✅)
```bash
# 1. 루트: 개발 도구만 설치
npm install  # concurrently만 설치 (29 packages)

# 2. 각 프로젝트: 독립적으로 설치
cd frontend && npm install       # React, Vite 등
cd backend && npm install        # Express, Sui SDK 등
cd frontend-admin && npm install # React, Vite 등

# 또는 한 번에
npm run install:all
```

## 🚀 실행 방법

### 개별 실행
```bash
# Frontend만 실행 (포트 3000)
cd frontend
npm run dev

# Backend만 실행 (포트 5000)
cd backend
npm run dev

# Admin만 실행 (포트 3001)
cd frontend-admin
npm run dev
```

### 동시 실행 (권장)
```bash
# 루트에서 모든 서비스 동시 실행
npm run dev

# concurrently가 내부적으로 실행:
# - cd frontend && npm run dev
# - cd backend && npm run dev
# - cd frontend-admin && npm run dev
```

## 🏗️ 빌드 방법

### 개별 빌드
```bash
# Frontend 빌드
cd frontend
npm run build
# → frontend/dist/ 생성

# Admin 빌드
cd frontend-admin
npm run build
# → frontend-admin/dist/ 생성

# Backend (빌드 불필요)
cd backend
# Node.js는 소스 그대로 실행
```

### 일괄 빌드
```bash
# 루트에서 Frontend + Admin 빌드
npm run build

# 내부적으로 실행:
# - cd frontend && npm run build
# - cd frontend-admin && npm run build
```

## 📝 루트 package.json의 역할

루트의 package.json은 **워크스페이스 관리자** 역할만 합니다:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" ...",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:frontend && npm run build:admin",
    ...
  },
  "devDependencies": {
    "concurrently": "^8.2.2"  // 이것만!
  }
}
```

**중요**: 
- 루트는 실제 프로젝트 의존성을 가지지 않음
- `concurrently` 같은 개발 도구만 설치
- 각 프로젝트로 `cd` 후 `npm` 명령 실행

## ⚠️ 주의사항

### 1. 의존성 설치 위치
```bash
# ❌ 잘못된 예
cd d:\_a_globalbusan_xyz_investment_page
npm install react  # 루트에 설치 (잘못됨!)

# ✅ 올바른 예
cd d:\_a_globalbusan_xyz_investment_page/frontend
npm install react  # frontend에 설치 (올바름!)
```

### 2. 빌드 출력 위치
```bash
frontend/dist/        # Frontend 빌드 결과
frontend-admin/dist/  # Admin 빌드 결과
# ❌ NOT: dist/ (루트에 생성되면 안 됨!)
```

### 3. node_modules 위치
```bash
node_modules/               # 루트: concurrently만
frontend/node_modules/      # Frontend 의존성
backend/node_modules/       # Backend 의존성
frontend-admin/node_modules/# Admin 의존성
```

## ✅ 테스트 결과

```bash
PS D:\_a_globalbusan_xyz_investment_page> npm install

added 29 packages, and audited 30 packages in 41s
found 0 vulnerabilities
```

✅ **성공**: 루트에는 concurrently만 설치되었습니다 (29 packages)

## 🎯 올바른 워크플로우

### 초기 설정
```bash
# 1. 저장소 클론
git clone <repo>
cd globalbusan-monorepo

# 2. 루트 도구 설치
npm install

# 3. 모든 프로젝트 의존성 설치
npm run install:all
```

### 개발
```bash
# 모든 서비스 동시 실행
npm run dev

# 브라우저에서 테스트
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000/api
# - Admin: http://localhost:3001
```

### 배포
```bash
# 빌드
npm run build

# 각 서비스 배포
# - Frontend/Admin: Vercel/Netlify
# - Backend: Heroku/Railway
```

## 📊 최종 확인

| 항목 | 상태 | 설명 |
|------|------|------|
| 루트 package.json | ✅ | concurrently만 포함 (29 packages) |
| Frontend package.json | ✅ | 독립적인 의존성 |
| Backend package.json | ✅ | 독립적인 의존성 |
| Admin package.json | ✅ | 독립적인 의존성 |
| 빌드 스크립트 | ✅ | 각 프로젝트로 cd 후 실행 |
| 동시 실행 | ✅ | concurrently로 관리 |

---

**결론**: 모노레포 구조가 올바르게 설정되었습니다! 각 프로젝트는 독립적으로 빌드되며, 루트는 단순히 통합 스크립트만 제공합니다.
