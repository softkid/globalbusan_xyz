# Global BUSAN Move Contract 배포 가이드

## 로컬 개발 환경 설정

### 1. Sui CLI 설치

**macOS/Linux:**
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

**Windows:**
```powershell
# Rust 설치 (https://rustup.rs/)
# 그 다음
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

### 2. Sui 지갑 설정

```bash
# 새 지갑 생성
sui client new-address ed25519

# 기존 지갑 가져오기 (니모닉)
sui client import-keypair

# 활성 주소 확인
sui client active-address
```

### 3. 테스트넷 토큰 받기

```bash
# Sui 테스트넷 faucet
sui client faucet

# 또는 Discord faucet 사용
# https://discord.gg/sui
```

## 빌드 및 테스트

### 빌드
```bash
cd contract
sui move build
```

### 테스트 실행
```bash
sui move test
```

### 특정 테스트만 실행
```bash
sui move test --filter donation
```

## 테스트넷 배포

### 1. 환경 확인
```bash
# 현재 네트워크 확인
sui client active-env

# testnet으로 변경 (필요시)
sui client switch --env testnet
```

### 2. 배포 실행
```bash
cd contract
sui client publish --gas-budget 100000000
```

### 3. 배포 결과 저장

출력에서 다음 정보를 찾아 저장:

```
Published Objects:
  PackageID: 0xabcd1234...
  
Created Objects:
  ObjectID: 0xefgh5678...  (DonationPool)
```

### 4. 프론트엔드 설정

`src/lib/smartContract.js` 업데이트:

```javascript
export const SUI_CONTRACT = {
  PACKAGE_ID: '0xabcd1234...', // 위에서 저장한 PackageID
  DONATION_POOL_ID: '0xefgh5678...', // DonationPool ObjectID
  NETWORK: 'testnet',
  RPC_URL: 'https://fullnode.testnet.sui.io:443'
}
```

## 메인넷 배포

### ⚠️ 배포 전 체크리스트

- [ ] 테스트넷에서 충분한 테스트 완료
- [ ] 코드 감사(audit) 완료 권장
- [ ] 메인넷 지갑에 충분한 SUI 확보
- [ ] 백업 및 복구 계획 수립
- [ ] 관리자 키 보안 설정 (멀티시그 권장)

### 1. 메인넷으로 전환

```bash
sui client switch --env mainnet
```

### 2. 메인넷 배포

```bash
cd contract
sui client publish --gas-budget 100000000
```

### 3. 프로덕션 환경 변수 설정

```env
# .env.production
VITE_SUI_PACKAGE_ID=0x...
VITE_SUI_DONATION_POOL_ID=0x...
VITE_SUI_NETWORK=mainnet
VITE_SUI_RPC_URL=https://fullnode.mainnet.sui.io:443
```

## 컨트랙트 업그레이드

Sui는 불변 패키지를 사용하므로 업그레이드 시 새 패키지를 배포해야 합니다.

### 1. 새 버전 배포
```bash
# Move.toml에서 버전 업데이트
# version = "0.2.0"

sui client publish --gas-budget 100000000
```

### 2. 데이터 마이그레이션 (필요시)
```bash
# 이전 컨트랙트 데이터를 새 컨트랙트로 이관하는 스크립트 작성
```

### 3. 프론트엔드 업데이트
```javascript
// 새 Package ID로 업데이트
export const SUI_CONTRACT = {
  PACKAGE_ID: '0xnew_package_id...',
  // ...
}
```

## 배포 후 검증

### 1. 컨트랙트 조회
```bash
# Package 정보 조회
sui client object <PACKAGE_ID>

# DonationPool 정보 조회
sui client object <DONATION_POOL_ID>
```

### 2. 함수 호출 테스트
```bash
# donate 함수 테스트
sui client call \
  --package <PACKAGE_ID> \
  --module donation_pool \
  --function donate \
  --args <POOL_ID> <COIN_ID> "Test donation" \
  --gas-budget 10000000
```

### 3. 이벤트 모니터링
```bash
# 이벤트 조회
sui client events --package <PACKAGE_ID>
```

## CI/CD 통합

### GitHub Actions 예시

```yaml
# .github/workflows/deploy-contract.yml
name: Deploy Sui Contract

on:
  push:
    branches: [main]
    paths:
      - 'contract/**'

jobs:
  deploy-testnet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Sui CLI
        run: |
          cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
      
      - name: Build contract
        run: |
          cd contract
          sui move build
      
      - name: Run tests
        run: |
          cd contract
          sui move test
      
      # Deployment step (주의: 키 관리 필요)
      # - name: Deploy to testnet
      #   env:
      #     SUI_PRIVATE_KEY: ${{ secrets.SUI_PRIVATE_KEY }}
      #   run: |
      #     cd contract
      #     sui client publish --gas-budget 100000000
```

## 문제 해결

### "Insufficient gas" 오류
```bash
# 가스 예산 증가
sui client publish --gas-budget 200000000
```

### "Module verification failed"
```bash
# 의존성 검증 스킵 (개발 중에만)
sui client publish --skip-dependency-verification --gas-budget 100000000
```

### 빌드 캐시 문제
```bash
# 빌드 캐시 삭제
rm -rf contract/build/
sui move build
```

## 모니터링 및 유지보수

### 1. 트랜잭션 모니터링
- Sui Explorer: https://suiexplorer.com/
- 테스트넷: https://testnet.suivision.xyz/

### 2. 로그 및 이벤트
```bash
# 특정 패키지의 이벤트 조회
sui client events --package <PACKAGE_ID>
```

### 3. 가스 사용량 추적
```bash
# 최근 트랜잭션 조회
sui client transactions --address <ADDRESS>
```

## 보안 체크리스트

- [ ] 관리자 권한 함수에 적절한 권한 검사 구현
- [ ] 재진입 공격 방어
- [ ] 정수 오버플로우/언더플로우 검사
- [ ] 이벤트 발행으로 투명성 확보
- [ ] 긴급 정지(pause) 메커니즘 구현
- [ ] 멀티시그 지갑 사용
- [ ] 정기적인 보안 감사

## 추가 리소스

- [Sui Documentation](https://docs.sui.io/)
- [Move Language Book](https://move-language.github.io/move/)
- [Sui Discord](https://discord.gg/sui)
- [Sui GitHub](https://github.com/MystenLabs/sui)
