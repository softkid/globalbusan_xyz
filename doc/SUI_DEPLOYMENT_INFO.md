# Sui Testnet Deployment Information

## Deployment Date
- **Date**: January 2024
- **Network**: Sui Testnet
- **Transaction Digest**: `2mQz4j8RMKavfN7jSVemJEqsC9SNDhtGXixNFnpD3uhU`

## Deployed Contract Addresses

### Package Information
- **Package ID**: `0xa97fe61730efb81c96a93e21c89a4eeb3b78eb0c86d00aa004403bf3a1d570a4`
- **Version**: 1
- **Modules**: 
  - `donation_pool`
  - `investment_project`

### Created Objects

#### DonationPool (Shared Object)
- **Object ID**: `0xd1cd176c5f024bb812c0b74d580f269d9f7b673c94125c259f1bcb4947c49bde`
- **Owner**: Shared (available at version 349181154)
- **Type**: `donation_pool::DonationPool`
- **Description**: Main donation pool contract that handles donations

#### UpgradeCap (Owned Object)
- **Object ID**: `0xc99c4bb7fe6abdb4994b8b41cd7cc5fb4843115ab54359a57a63edaaa4d7a579`
- **Owner**: `0xd24b4546ddbbd0ba0ca3801534c9f08695a2e9396daccb59b8665694d57c3f3f`
- **Type**: `0x2::package::UpgradeCap`
- **Description**: Capability object for upgrading the package

## Deployment Details

### Gas Usage
- **Storage Cost**: 37,665,600 MIST (0.0377 SUI)
- **Computation Cost**: 1,000,000 MIST (0.001 SUI)
- **Storage Rebate**: 978,120 MIST (0.00098 SUI)
- **Total Cost**: 37,687,480 MIST (~0.0377 SUI)

### Deployer Information
- **Address**: `0xd24b4546ddbbd0ba0ca3801534c9f08695a2e9396daccb59b8665694d57c3f3f`

## Explorer Links

### Sui Explorer (Testnet)
- **Package**: https://testnet.suivision.xyz/package/0xa97fe61730efb81c96a93e21c89a4eeb3b78eb0c86d00aa004403bf3a1d570a4
- **Transaction**: https://testnet.suivision.xyz/txblock/2mQz4j8RMKavfN7jSVemJEqsC9SNDhtGXixNFnpD3uhU
- **DonationPool Object**: https://testnet.suivision.xyz/object/0xd1cd176c5f024bb812c0b74d580f269d9f7b673c94125c259f1bcb4947c49bde

## Smart Contract Functions

### donation_pool Module

#### init
Initializes the donation pool (automatically called during deployment)

#### donate
```move
public fun donate(
    pool: &mut DonationPool,
    payment: Coin<SUI>,
    donor_name: Option<String>,
    message: Option<String>,
    ctx: &mut TxContext
)
```
Allows users to donate SUI tokens to the pool

#### withdraw
```move
public fun withdraw(
    pool: &mut DonationPool,
    amount: u64,
    admin_cap: &AdminCap,
    ctx: &mut TxContext
)
```
Allows admin to withdraw funds from the pool

### investment_project Module

#### create_project
```move
public fun create_project(
    name: String,
    description: String,
    goal_amount: u64,
    shares_count: u64,
    ctx: &mut TxContext
)
```
Creates a new investment project

#### invest
```move
public fun invest(
    project: &mut InvestmentProject,
    payment: Coin<SUI>,
    shares: u64,
    ctx: &mut TxContext
)
```
Allows users to invest in a project

#### close_project
```move
public fun close_project(
    project: &mut InvestmentProject,
    admin_cap: &AdminCap,
    ctx: &mut TxContext
)
```
Closes an investment project (admin only)

## Frontend Integration

Environment variables have been added to `.env`:
```env
VITE_SUI_PACKAGE_ID=0xa97fe61730efb81c96a93e21c89a4eeb3b78eb0c86d00aa004403bf3a1d570a4
VITE_SUI_DONATION_POOL_ID=0xd1cd176c5f024bb812c0b74d580f269d9f7b673c94125c259f1bcb4947c49bde
VITE_SUI_UPGRADE_CAP_ID=0xc99c4bb7fe6abdb4994b8b41cd7cc5fb4843115ab54359a57a63edaaa4d7a579
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

## Next Steps

1. ✅ Smart contracts deployed to Sui testnet
2. ✅ Environment variables configured
3. ⏳ Update frontend components to interact with deployed contracts
4. ⏳ Test donation and investment flows
5. ⏳ Monitor contract usage and performance

## Important Notes

- **Network**: Currently deployed on Sui **TESTNET** - do not use real funds
- **Upgradeability**: The UpgradeCap is owned by the deployer address and can be used to upgrade the contract
- **Shared Objects**: DonationPool is a shared object, accessible by all users
- **Gas Costs**: Users will need SUI tokens for transaction fees when interacting with contracts

## Verification

To verify the deployment:

```bash
# Check package info
sui client object 0xa97fe61730efb81c96a93e21c89a4eeb3b78eb0c86d00aa004403bf3a1d570a4

# Check DonationPool
sui client object 0xd1cd176c5f024bb812c0b74d580f269d9f7b673c94125c259f1bcb4947c49bde

# View transaction details
sui client tx-block 2mQz4j8RMKavfN7jSVemJEqsC9SNDhtGXixNFnpD3uhU
```
