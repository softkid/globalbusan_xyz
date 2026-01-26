# Global BUSAN Sui Move Contracts

이 디렉토리는 Global BUSAN 프로젝트의 Sui 블록체인 스마트 컨트랙트를 포함합니다.

## 구조

```
contract/
├── Move.toml                      # Move 패키지 매니페스트
├── sources/                       # Move 모듈 소스 코드
│   ├── donation_pool.move         # 기부금 풀 컨트랙트
│   └── investment_project.move    # 투자 프로젝트 컨트랙트
├── tests/                         # 테스트 코드
└── scripts/                       # 빌드/배포 스크립트
    ├── build.sh                   # Unix 빌드 스크립트
    ├── build.bat                  # Windows 빌드 스크립트
    ├── deploy-testnet.sh          # 테스트넷 배포
    └── deploy-mainnet.sh          # 메인넷 배포
```

## 컨트랙트

### 1. donation_pool.move
기부금을 받고 관리하는 스마트 컨트랙트입니다.

**주요 기능:**
- `donate()`: SUI를 기부하고 기부 영수증 NFT 받기
- `withdraw()`: 관리자가 자금 인출
- `set_active()`: 기부 풀 활성화/비활성화
- 기부자 추적 및 통계

**이벤트:**
- `DonationEvent`: 기부 발생 시
- `WithdrawalEvent`: 자금 인출 시

### 2. investment_project.move
투자 프로젝트를 생성하고 투자를 받는 컨트랙트입니다.

**주요 기능:**
- `create_project()`: 새 투자 프로젝트 생성
- `invest()`: 프로젝트에 투자하고 지분 NFT 받기
- `withdraw_funds()`: 프로젝트 창작자가 자금 인출 (목표 달성 후)
- `cancel_project()`: 프로젝트 취소

**이벤트:**
- `ProjectCreatedEvent`: 프로젝트 생성 시
- `InvestmentEvent`: 투자 발생 시
- `ProjectFundedEvent`: 목표 금액 달성 시

## 빌드 및 테스트

### 사전 요구사항
Sui CLI 설치가 필요합니다:
```bash
# macOS/Linux
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# 또는 공식 가이드 참조
# https://docs.sui.io/build/install
```

### 빌드

**Unix/Linux/macOS:**
```bash
cd contract
chmod +x scripts/build.sh
./scripts/build.sh
```

**Windows:**
```cmd
cd contract
scripts\build.bat
```

**또는 직접:**
```bash
cd contract
sui move build
sui move test
```

## 배포

### 테스트넷 배포

1. Sui 환경 설정:
```bash
sui client active-env
# testnet으로 설정되어 있는지 확인
```

2. 배포:
```bash
cd contract
chmod +x scripts/deploy-testnet.sh
./scripts/deploy-testnet.sh
```

3. 배포 결과에서 다음 정보 저장:
   - Package ID
   - DonationPool Object ID
   - InvestmentProject Module ID

4. 프론트엔드 설정 업데이트:
```javascript
// src/lib/smartContract.js
export const SUI_CONTRACT = {
  PACKAGE_ID: '0x...', // 위에서 저장한 Package ID
  DONATION_POOL_ID: '0x...', // DonationPool Object ID
  // ...
}
```

### 메인넷 배포

**⚠️ 주의: 메인넷 배포는 실제 SUI 토큰을 소비합니다!**

1. Sui 환경을 mainnet으로 변경:
```bash
sui client switch --env mainnet
```

2. 배포:
```bash
cd contract
chmod +x scripts/deploy-mainnet.sh
./scripts/deploy-mainnet.sh
```

3. 프로덕션 환경 변수에 배포 정보 저장

## 개발 워크플로우

1. **로컬 개발:**
   ```bash
   sui move build
   sui move test
   ```

2. **테스트넷 테스트:**
   ```bash
   ./scripts/deploy-testnet.sh
   # 프론트엔드에서 테스트
   ```

3. **메인넷 배포:**
   ```bash
   # 충분한 테스트 후
   ./scripts/deploy-mainnet.sh
   ```

## 환경 변수

프론트엔드에서 사용할 환경 변수:

```env
# .env
VITE_SUI_PACKAGE_ID=0x...
VITE_SUI_DONATION_POOL_ID=0x...
VITE_SUI_NETWORK=testnet  # 또는 mainnet
```

## 보안 고려사항

- 관리자 키는 안전하게 보관
- 메인넷 배포 전 테스트넷에서 충분한 테스트
- 감사(audit)를 거친 후 메인넷 배포 권장
- 멀티시그 지갑 사용 권장

## 문제 해결

### "sui command not found"
```bash
# Sui CLI 설치 확인
which sui

# 없다면 설치
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

### "Insufficient gas"
```bash
# 가스 예산 증가
sui client publish --gas-budget 200000000
```

### 빌드 오류
```bash
# 캐시 정리 후 재빌드
rm -rf build/
sui move build
```

## 추가 리소스

- [Sui Move 문서](https://docs.sui.io/build/move)
- [Sui Examples](https://github.com/MystenLabs/sui/tree/main/examples)
- [Move Book](https://move-language.github.io/move/)
