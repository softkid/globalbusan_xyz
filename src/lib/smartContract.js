// Sui testnet smart contract integration for donation and investment modules
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

// Contract addresses (loaded from environment variables)
export const SUI_PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || '0x0';
export const SUI_DONATION_POOL_ID = import.meta.env.VITE_SUI_DONATION_POOL_ID || '0x0';
export const SUI_UPGRADE_CAP_ID = import.meta.env.VITE_SUI_UPGRADE_CAP_ID || '0x0';
export const SUI_RPC_URL = import.meta.env.VITE_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443';

// Module and function names
export const DONATION_MODULE = 'donation_pool';
export const INVESTMENT_MODULE = 'investment_project';

// Sui Provider singleton
let suiClient = null;

/**
 * Initialize and return Sui client
 */
export function getSuiProvider() {
  if (!suiClient) {
    suiClient = new SuiClient({ url: SUI_RPC_URL });
  }
  return suiClient;
}

/**
 * Build transaction for donation
 * @param {string} donorAddress - Donor wallet address
 * @param {string} donationAmount - Amount in MIST (1 SUI = 1e9 MIST)
 * @param {string} donorName - Optional donor name
 * @param {string} message - Optional donation message
 * @returns {TransactionBlock} - Prepared transaction
 */
export function buildDonationTransaction(donorAddress, donationAmount, donorName = '', message = '') {
  const tx = new TransactionBlock();
  
  // Convert amount to MIST
  const mist = String(donationAmount);
  
  // Split coin for payment if needed
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(mist)]);
  
  // Call donate function
  tx.moveCall({
    target: `${SUI_PACKAGE_ID}::${DONATION_MODULE}::donate`,
    arguments: [
      tx.object(SUI_DONATION_POOL_ID),  // pool: &mut DonationPool
      coin,                              // payment: Coin<SUI>
      tx.pure(donorName ? donorName : null, 'Option<String>'),  // donor_name
      tx.pure(message ? message : null, 'Option<String>'),      // message
    ],
  });
  
  return tx;
}

/**
 * Build transaction for investment
 * @param {string} projectId - Object ID of the investment project
 * @param {string} investorAddress - Investor wallet address
 * @param {string} investmentAmount - Amount in MIST
 * @param {number} shares - Number of shares to purchase
 * @returns {TransactionBlock} - Prepared transaction
 */
export function buildInvestmentTransaction(projectId, investorAddress, investmentAmount, shares) {
  const tx = new TransactionBlock();
  
  // Convert amount to MIST
  const mist = String(investmentAmount);
  
  // Split coin for payment
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(mist)]);
  
  // Call invest function
  tx.moveCall({
    target: `${SUI_PACKAGE_ID}::${INVESTMENT_MODULE}::invest`,
    arguments: [
      tx.object(projectId),           // project: &mut InvestmentProject
      coin,                            // payment: Coin<SUI>
      tx.pure.u64(shares),             // shares: u64
    ],
  });
  
  return tx;
}

/**
 * Build transaction for creating investment project
 * @param {string} name - Project name
 * @param {string} description - Project description
 * @param {string} goalAmount - Goal amount in MIST
 * @param {number} sharesCount - Total number of shares
 * @returns {TransactionBlock} - Prepared transaction
 */
export function buildCreateProjectTransaction(name, description, goalAmount, sharesCount) {
  const tx = new TransactionBlock();
  
  tx.moveCall({
    target: `${SUI_PACKAGE_ID}::${INVESTMENT_MODULE}::create_project`,
    arguments: [
      tx.pure.string(name),
      tx.pure.string(description),
      tx.pure.u64(goalAmount),
      tx.pure.u64(sharesCount),
    ],
  });
  
  return tx;
}

/**
 * Get donation pool information
 */
export async function getDonationPoolInfo() {
  try {
    const client = getSuiProvider();
    const poolObject = await client.getObject({
      id: SUI_DONATION_POOL_ID,
      options: { showContent: true, showType: true },
    });
    return poolObject;
  } catch (error) {
    console.error('Error fetching donation pool info:', error);
    return null;
  }
}

/**
 * Get investment project information
 * @param {string} projectId - Project object ID
 */
export async function getProjectInfo(projectId) {
  try {
    const client = getSuiProvider();
    const projectObject = await client.getObject({
      id: projectId,
      options: { showContent: true, showType: true },
    });
    return projectObject;
  } catch (error) {
    console.error('Error fetching project info:', error);
    return null;
  }
}

/**
 * Estimate gas cost for transaction
 * @param {TransactionBlock} tx - Transaction to estimate
 * @param {string} userAddress - User wallet address
 */
export async function estimateGasCost(tx, userAddress) {
  try {
    const client = getSuiProvider();
    tx.setGasBudget(1000000); // Temporary budget for estimation
    
    const dryRunResult = await client.dryRunTransactionBlock({
      transactionBlock: tx,
    });
    
    if (dryRunResult.effects?.gasUsed) {
      return {
        computationCost: dryRunResult.effects.gasUsed.computationCost,
        storageCost: dryRunResult.effects.gasUsed.storageCost,
        storageRebate: dryRunResult.effects.gasUsed.storageRebate,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error estimating gas:', error);
    return null;
  }
}

/**
 * Format MIST to SUI
 * @param {number} mist - Amount in MIST
 * @returns {string} - Formatted amount in SUI
 */
export function mistToSui(mist) {
  return (mist / 1e9).toFixed(6);
}

/**
 * Format SUI to MIST
 * @param {number} sui - Amount in SUI
 * @returns {string} - Formatted amount in MIST
 */
export function suiToMist(sui) {
  return Math.floor(sui * 1e9);
}

export default {
  SUI_PACKAGE_ID,
  SUI_DONATION_POOL_ID,
  SUI_UPGRADE_CAP_ID,
  SUI_RPC_URL,
  DONATION_MODULE,
  INVESTMENT_MODULE,
  getSuiProvider,
  buildDonationTransaction,
  buildInvestmentTransaction,
  buildCreateProjectTransaction,
  getDonationPoolInfo,
  getProjectInfo,
  estimateGasCost,
  mistToSui,
  suiToMist,
};

