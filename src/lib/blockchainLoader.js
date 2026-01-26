/**
 * Safe lazy loader for blockchain functionality
 * Ensures blockchain-vendor chunk is loaded before any blockchain code executes
 * Prevents "Cannot access X before initialization" errors from circular dependencies
 */

let blockchainModule = null;
let blockchainPromise = null;

/**
 * Safely import and access blockchain module
 * Guarantees initialization order and prevents TDZ errors
 */
async function loadBlockchainModule() {
  if (!blockchainModule) {
    if (!blockchainPromise) {
      blockchainPromise = import('./blockchain.js');
    }
    blockchainModule = await blockchainPromise;
  }
  return blockchainModule;
}

/**
 * Create a lazy proxy that loads blockchain module on first use
 */
export async function getBlockchainFunctions() {
  const module = await loadBlockchainModule();
  return {
    connectSuiWallet: module.connectSuiWallet,
    sendSuiTransaction: module.sendSuiTransaction,
    waitForSuiTransaction: module.waitForSuiTransaction,
    verifySuiTransaction: module.verifySuiTransaction,
    getSuiExplorerLink: module.getSuiExplorerLink,
  };
}

export default {
  loadBlockchainModule,
  getBlockchainFunctions,
};
