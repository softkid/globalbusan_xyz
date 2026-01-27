# Backend API - Cloudflare Workers

Global Busan XYZ Investment Platform의 Backend API입니다. Hono 프레임워크를 사용하여 Cloudflare Workers에서 실행됩니다.

## 🚀 기술 스택

- **프레임워크**: Hono
- **런타임**: Cloudflare Workers (Edge Computing)
- **데이터베이스**: Supabase (PostgreSQL)
- **블록체인**: Sui Network (@mysten/sui.js)
- **검증**: Joi
- **배포**: Wrangler

## 📦 설치

```bash
npm install
```

## 🛠️ 개발

```bash
# 로컬 개발 서버 (포트: 8787)
npm run dev

# Wrangler 로그 확인
npm run tail
```

## 🌐 API 엔드포인트

### Health Check
- `GET /health` - 서버 상태 확인

### Donations (기부)
- `GET /api/donations` - 모든 기부 조회
- `GET /api/donations/:id` - 특정 기부 조회
- `POST /api/donations` - 새로운 기부 생성 (블록체인 검증 포함)
- `GET /api/donations/stats/summary` - 기부 통계

### Investments (투자)
- `GET /api/investments` - 모든 투자 조회
- `POST /api/investments` - 새로운 투자 생성

### Projects (프로젝트)
- `GET /api/projects` - 모든 프로젝트 조회
- `GET /api/projects/:id` - 특정 프로젝트 조회

### Stats (통계)
- `GET /api/stats` - 전체 통계

### Auth (인증)
- `POST /api/auth/login` - 로그인 (준비 중)
- `POST /api/auth/logout` - 로그아웃 (준비 중)

## 🔐 환경 변수

### 로컬 개발
`.dev.vars` 파일 생성:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PACKAGE_ID=0xa97fe...
SUI_DONATION_POOL_ID=0xd1cd...
ENVIRONMENT=development
```

### 프로덕션
Wrangler secret 사용:

```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
wrangler secret put SUI_RPC_URL
wrangler secret put SUI_PACKAGE_ID
wrangler secret put SUI_DONATION_POOL_ID
```

## 🚢 배포

```bash
# 개발 환경 배포
npm run deploy

# 프로덕션 환경 배포
npm run deploy:prod
```

## 🔒 보안 기능

- **Secure Headers**: HTTP 헤더 보안
- **CORS**: 크로스 오리진 요청 제어
- **Rate Limiting**: 15분당 100 요청 제한 (Cloudflare IP 기반)
- **Input Validation**: Joi 스키마 검증
- **Blockchain Verification**: Sui 네트워크 거래 검증

## 📖 Cloudflare Workers 특징

- **Edge Computing**: 전 세계 200+ 데이터센터에서 실행
- **Zero Cold Start**: 즉각적인 응답 시간
- **Auto Scaling**: 자동 스케일링
- **No Server Management**: 서버 관리 불필요
- **Low Latency**: 사용자와 가장 가까운 위치에서 실행

## 📁 프로젝트 구조

```
backend/
├── src/
│   ├── index.js          # Main Hono app
│   └── routes/           # API routes
│       ├── donation.js   # 기부 API
│       ├── investment.js # 투자 API
│       ├── project.js    # 프로젝트 API
│       ├── stats.js      # 통계 API
│       └── auth.js       # 인증 API
├── wrangler.toml         # Cloudflare Workers 설정
├── .dev.vars.example     # 환경 변수 예제
└── package.json          # 의존성
```

## 🧪 테스트

```bash
npm test
```

## 📝 참고 자료

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Sui SDK](https://docs.sui.io/devnet/build/sui-ts-sdk)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
