# Sui 블록체인 통합 완성 가이드

## 🎉 완료 사항

### 1. 스마트 계약 배포 ✅
- **네트워크**: Sui Testnet
- **배포 TX**: `2mQz4j8RMKavfN7jSVemJEqsC9SNDhtGXixNFnpD3uhU`
- **Package ID**: `0xa97fe61730efb81c96a93e21c89a4eeb3b78eb0c86d00aa004403bf3a1d570a4`
- **Donation Pool**: `0xd1cd176c5f024bb812c0b74d580f269d9f7b673c94125c259f1bcb4947c49bde`
- **Upgrade Cap**: `0xc99c4bb7fe6abdb4994b8b41cd7cc5fb4843115ab54359a57a63edaaa4d7a579`

### 2. 프론트엔드 통합 라이브러리 ✅
- `src/lib/smartContract.js` - 모든 스마트 계약 상호작용 처리
- 트랜잭션 빌더 함수들
- 가스 비용 계산
- 단위 변환 유틸리티

### 3. 커스텀 Hooks ✅
- `useSuiWallet.js` - 지갑 연결 관리
- `useSuiDonation.js` - 기부 관리
- `useSuiInvestment.js` - 투자 관리

### 4. 사용자 인터페이스 ✅

#### 기부 페이지 (`/donation`)
- 기부 금액 입력 (SUI)
- 기부자 이름 (선택사항)
- 기부 메시지 (선택사항)
- 실시간 거래 상태 추적
- 기부 기록 표시

#### 투자 페이지 (`/investment`)
- 프로젝트 선택 드롭다운
- 투자 금액 입력 (SUI)
- 투자자 이름 및 추가 정보 입력
- 최소 투자액 검증
- 투자 기록 및 통계

#### 거래 기록 페이지 (`/transaction-history`)
- 모든 기부 및 투자 기록 표시
- 필터링 (기부만, 투자만, 전체)
- 검색 기능
- 정렬 옵션 (날짜, 금액)
- CSV 내보내기
- SuiScan 탐색기 링크

### 5. 네비게이션 업데이트 ✅
Navbar에 새로운 메뉴 항목 추가:
- 기부 (기부 페이지로 이동)
- 투자 (투자 페이지로 이동)
- 거래 기록 (히스토리 페이지로 이동)
- 지갑 연결 버튼 (Connect Wallet / 지갑 주소 표시)

## 🚀 사용 방법

### 기부하기
1. 네비게이션의 "기부" 메뉴 클릭
2. "지갑 연결" 버튼을 눌러 Sui Wallet 연결
3. 기부 금액 입력 (SUI)
4. 기부자 이름 (선택) 및 메시지 (선택) 입력
5. "기부하기" 버튼 클릭
6. 지갑에서 거래 서명 및 승인
7. 거래 완료 후 기록 저장

### 투자하기
1. 네비게이션의 "투자" 메뉴 클릭
2. "지갑 연결" 버튼을 눌러 Sui Wallet 연결
3. 드롭다운에서 프로젝트 선택
4. 투자 금액 입력 (프로젝트의 최소 투자액 이상)
5. 투자자 이름 및 추가 정보 (선택) 입력
6. "투자하기" 버튼 클릭
7. 지갑에서 거래 서명 및 승인
8. 거래 완료 후 기록 저장

### 거래 기록 확인
1. 네비게이션의 "거래 기록" 메뉴 클릭
2. 통계 카드에서 총 거래액, 건수 확인
3. "거래 유형" 필터로 기부/투자 구분
4. 검색창에서 설명이나 거래 해시 검색
5. "정렬" 옵션으로 날짜 또는 금액 정렬
6. "보기" 링크를 눌러 SuiScan에서 거래 확인
7. "CSV로 다운로드" 버튼으로 모든 기록 내보내기

## 📱 기술 구성

### 환경 변수 (.env)
```env
# Sui 블록체인
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_SUI_PACKAGE_ID=0xa97fe61730efb81c96a93e21c89a4eeb3b78eb0c86d00aa004403bf3a1d570a4
VITE_SUI_DONATION_POOL_ID=0xd1cd176c5f024bb812c0b74d580f269d9f7b673c94125c259f1bcb4947c49bde
VITE_SUI_UPGRADE_CAP_ID=0xc99c4bb7fe6abdb4994b8b41cd7cc5fb4843115ab54359a57a63edaaa4d7a579
```

### 의존성
- `@mysten/sui.js` v0.54.1 - Sui SDK
- `react` v18.3.1 - UI 프레임워크
- `react-router-dom` v7.9.3 - 라우팅
- `tailwind-css` - 스타일링
- `react-icons` - 아이콘

### 포트 및 URL
- **개발 서버**: http://localhost:3000
- **기부 페이지**: http://localhost:3000/donation
- **투자 페이지**: http://localhost:3000/investment
- **거래 기록**: http://localhost:3000/transaction-history
- **SuiScan 탐색기**: https://suiscan.xyz/testnet

## 💾 데이터 저장소
현재 시스템은 localStorage를 사용하여 로컬에 기부/투자 기록을 저장합니다:
- `donationHistory` - 기부 기록
- `investmentHistory` - 투자 기록

모든 거래는 Sui 블록체인 테스트넷에 기록되며, 거래 해시를 통해 SuiScan에서 조회 가능합니다.

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 테스트 실행
npm run test

# 린트 실행
npm run lint
```

## 🔐 보안 고려사항

1. **Sui Wallet 필수**: 모든 거래는 Sui Wallet 확장 프로그램이 설치되어야 함
2. **테스트넷 전용**: 현재 Sui Testnet을 사용 중 (테스트 목적)
3. **서명 필수**: 모든 거래는 사용자의 지갑 승인이 필요
4. **최소 투자액**: 각 프로젝트마다 최소 투자액이 설정됨

## 📊 성능 최적화

- Lazy loading으로 페이지별 코드 분할
- 블록체인 상호작용 비동기 처리
- localStorage 캐싱으로 재요청 방지
- Tailwind CSS로 최소 번들 크기 유지

## 🐛 알려진 문제 및 주의사항

1. **Sui Wallet 확장 필수**: 브라우저에 Sui Wallet 확장이 설치되어야 함
2. **버전 호환성**: @mysten/sui.js v0.54.1 사용 (호환성 문제)
3. **가스 비용**: 각 거래마다 약 0.001-0.01 SUI 가스비 발생
4. **테스트넷 제한**: 테스트 SUI 토큰만 사용 가능

## 🚀 다음 단계

### 즉시 해야 할 작업
- [ ] Sui Wallet 브라우저 확장 설치 및 테스트 계정 생성
- [ ] 기부 페이지 실제 거래 테스트
- [ ] 투자 페이지 실제 거래 테스트
- [ ] 거래 기록 페이지 검증

### 향후 개선 사항
- [ ] 프로덕션 Sui Mainnet으로 마이그레이션
- [ ] 백엔드 API와 연동 (현재 localStorage 사용)
- [ ] 더 많은 프로젝트 추가
- [ ] 투자 ROI 계산 및 배당금 시스템
- [ ] 관리자 대시보드 구현
- [ ] 거래 내역 서버 저장
- [ ] 결제 게이트웨이 통합 (더 많은 결제 방법)

## 📞 지원 및 문제 해결

### 지갑 연결 실패
- Sui Wallet 확장이 설치되어 있는지 확인
- 브라우저 콘솔에서 `window.suiWallet` 확인
- 네트워크가 Testnet으로 설정되어 있는지 확인

### 거래 실패
- 가스비 확인 (최소 0.01 SUI 필요)
- 지갑에 충분한 SUI 토큰이 있는지 확인
- 네트워크 연결 상태 확인
- 최소 투자액 확인

### 거래 기록이 보이지 않음
- 브라우저 개발자 도구의 Application > Local Storage 확인
- 기부/투자가 성공했는지 확인
- 페이지 새로고침 시도

## 📈 통계

현재까지의 구현:
- **3개 컴포넌트**: Donation, Investment, TransactionHistory
- **3개 커스텀 Hook**: useSuiWallet, useSuiDonation, useSuiInvestment
- **2개 Move 스마트 계약**: donation_pool.move, investment_project.move
- **1개 통합 라이브러리**: smartContract.js
- **3개 라우트**: /donation, /investment, /transaction-history

마지막 커밋:
- `190e98a` - Add TransactionHistory page with CSV export and blockchain explorer links

---

**마지막 업데이트**: 2024년 12월
**상태**: ✅ 완료 및 테스트 준비
