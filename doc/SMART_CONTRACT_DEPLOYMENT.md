# 스마트 컨트랙트 배포 가이드

이 문서는 Global BUSAN 프로젝트의 스마트 컨트랙트 배포 및 테스트 방법을 안내합니다.

## 1. 개요

Global BUSAN은 투명한 기부 및 투자 관리를 위해 블록체인 스마트 컨트랙트를 사용합니다.

### 지원 네트워크
- **Ethereum Mainnet** - 메인 프로덕션 네트워크
- **Polygon Mainnet** - 낮은 가스비를 위한 레이어 2 솔루션
- **Solana Mainnet** - 고속 저비용 트랜잭션

## 2. 사전 준비

### 2.1 개발 환경 설정

```bash
# Node.js 18+ 설치 확인
node --version

# 필요한 패키지 설치
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install --save ethers @solana/web3.js
```

### 2.2 환경 변수 설정

`.env` 파일 생성:

```env
# Ethereum
PRIVATE_KEY=your_private_key_here
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
ETHERSCAN_API_KEY=your_etherscan_api_key

# Polygon
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=your_solana_private_key

# 테스트넷 (선택사항)
GOERLI_RPC_URL=https://goerli.infura.io/v3/YOUR_PROJECT_ID
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
```

## 3. 스마트 컨트랙트 작성

### 3.1 Ethereum/Polygon 컨트랙트 (Solidity)

`contracts/DonationContract.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DonationContract {
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string projectId;
    }

    address public owner;
    uint256 public totalDonations;
    Donation[] public donations;
    mapping(address => uint256) public donorBalances;

    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp,
        string projectId
    );

    constructor() {
        owner = msg.sender;
    }

    function donate(string memory projectId) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            projectId: projectId
        }));
        
        donorBalances[msg.sender] += msg.value;
        totalDonations += msg.value;
        
        emit DonationReceived(msg.sender, msg.value, block.timestamp, projectId);
    }

    function getDonationCount() public view returns (uint256) {
        return donations.length;
    }

    function getDonation(uint256 index) public view returns (
        address donor,
        uint256 amount,
        uint256 timestamp,
        string memory projectId
    ) {
        Donation memory donation = donations[index];
        return (donation.donor, donation.amount, donation.timestamp, donation.projectId);
    }

    function withdraw(address payable recipient, uint256 amount) public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance >= amount, "Insufficient balance");
        recipient.transfer(amount);
    }
}
```

### 3.2 Solana 프로그램 (Rust)

`programs/solana-donation/src/lib.rs`:

```rust
use anchor_lang::prelude::*;

declare_id!("YourProgramIdHere");

#[program]
pub mod solana_donation {
    use super::*;

    pub fn donate(ctx: Context<Donate>, amount: u64, project_id: String) -> Result<()> {
        let donation = &mut ctx.accounts.donation;
        donation.donor = ctx.accounts.donor.key();
        donation.amount = amount;
        donation.timestamp = Clock::get()?.unix_timestamp;
        donation.project_id = project_id;
        donation.bump = ctx.bumps.donation;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,
    #[account(
        init_if_needed,
        payer = donor,
        space = 8 + Donation::INIT_SPACE,
        seeds = [b"donation", donor.key().as_ref()],
        bump
    )]
    pub donation: Account<'info, Donation>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Donation {
    pub donor: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    pub project_id: String,
    pub bump: u8,
}
```

## 4. 배포 스크립트

### 4.1 Hardhat 배포 스크립트 (Ethereum/Polygon)

`scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const DonationContract = await hre.ethers.getContractFactory("DonationContract");
  const donationContract = await DonationContract.deploy();

  await donationContract.waitForDeployment();

  const address = await donationContract.getAddress();
  console.log("DonationContract deployed to:", address);

  // Verify on Etherscan/Polygonscan
  if (process.env.ETHERSCAN_API_KEY) {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 4.2 Solana 배포 스크립트

`scripts/deploy-solana.js`:

```javascript
const anchor = require('@project-serum/anchor');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const fs = require('fs');

async function main() {
  const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
  const wallet = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync(process.env.SOLANA_PRIVATE_KEY, 'utf-8')))
  );

  const programId = new PublicKey('YourProgramIdHere');
  
  // Deploy program
  // ... deployment logic
}

main();
```

## 5. 테스트

### 5.1 Hardhat 테스트

`test/DonationContract.test.js`:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationContract", function () {
  let donationContract;
  let owner;
  let donor;

  beforeEach(async function () {
    [owner, donor] = await ethers.getSigners();
    
    const DonationContract = await ethers.getContractFactory("DonationContract");
    donationContract = await DonationContract.deploy();
    await donationContract.waitForDeployment();
  });

  it("Should accept donations", async function () {
    const donationAmount = ethers.parseEther("1.0");
    
    await expect(
      donationContract.connect(donor).donate("project-1", { value: donationAmount })
    ).to.emit(donationContract, "DonationReceived");
    
    const totalDonations = await donationContract.totalDonations();
    expect(totalDonations).to.equal(donationAmount);
  });

  it("Should track donor balances", async function () {
    const donationAmount = ethers.parseEther("1.0");
    
    await donationContract.connect(donor).donate("project-1", { value: donationAmount });
    
    const donorBalance = await donationContract.donorBalances(donor.address);
    expect(donorBalance).to.equal(donationAmount);
  });
});
```

## 6. 배포 프로세스

### 6.1 테스트넷 배포 (권장)

1. **Goerli 테스트넷 배포**:
```bash
npx hardhat run scripts/deploy.js --network goerli
```

2. **Mumbai 테스트넷 배포**:
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

3. **Devnet 배포 (Solana)**:
```bash
anchor deploy --provider.cluster devnet
```

### 6.2 메인넷 배포

⚠️ **주의**: 메인넷 배포 전에 반드시 테스트넷에서 충분히 테스트하세요.

1. **Ethereum Mainnet**:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

2. **Polygon Mainnet**:
```bash
npx hardhat run scripts/deploy.js --network polygon
```

3. **Solana Mainnet**:
```bash
anchor deploy --provider.cluster mainnet
```

## 7. 컨트랙트 주소 업데이트

배포 후 다음 파일에 컨트랙트 주소를 업데이트하세요:

`src/lib/smartContract.js`:

```javascript
export const GLOBAL_BUSAN_DONATION_CONTRACT_ADDRESS = {
  ethereum: '0x...', // 배포된 주소
  polygon: '0x...',  // 배포된 주소
  solana: '...'       // 배포된 주소
}
```

## 8. 검증 및 모니터링

### 8.1 Etherscan/Polygonscan 검증

```bash
npx hardhat verify --network mainnet CONTRACT_ADDRESS
```

### 8.2 이벤트 모니터링

```javascript
// Ethereum/Polygon
const filter = contract.filters.DonationReceived();
contract.on(filter, (donor, amount, timestamp, projectId) => {
  console.log('New donation:', { donor, amount, timestamp, projectId });
});

// Solana
// WebSocket subscription for program events
```

## 9. 보안 체크리스트

- [ ] 컨트랙트 코드 감사 완료
- [ ] 테스트 커버리지 100%
- [ ] 재진입 공격 방어 (ReentrancyGuard)
- [ ] 오버플로우/언더플로우 방어
- [ ] 접근 제어 검증
- [ ] 가스 최적화 확인
- [ ] 업그레이드 가능성 검토

## 10. 문제 해결

### 일반적인 문제

1. **가스 부족**: 가스 한도 증가 또는 네트워크 변경
2. **트랜잭션 실패**: 네트워크 상태 확인 및 재시도
3. **검증 실패**: 컨트랙트 소스 코드 및 컴파일러 버전 확인

## 11. 참고 자료

- [Hardhat 문서](https://hardhat.org/docs)
- [Solidity 문서](https://docs.soliditylang.org/)
- [Anchor 문서](https://www.anchor-lang.com/)
- [Etherscan API](https://docs.etherscan.io/)
- [Solana 개발자 문서](https://docs.solana.com/)

---

**마지막 업데이트**: 2025-12-13

