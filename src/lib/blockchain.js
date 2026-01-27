// Sui-only blockchain helpers targeting the public testnet RPC
const SUI_RPC_ENDPOINT = "https://fullnode.testnet.sui.io:443";

export async function connectSuiWallet() {
  const suiWallet = typeof window !== "undefined" ? window.suiWallet : undefined;
  if (!suiWallet) {
    throw new Error("Sui wallet not detected. Please install a Sui-compatible wallet.");
  }

  await suiWallet.requestPermissions?.({ permissions: ["viewAccount", "suggestTransactions"] });
  const accounts = await suiWallet.getAccounts();
  if (!accounts || accounts.length === 0) {
    throw new Error("No Sui accounts available in the wallet.");
  }
  return accounts[0]?.address;
}

export async function sendSuiTransaction({ sender, recipient, amount }) {
  const suiWallet = typeof window !== "undefined" ? window.suiWallet : undefined;
  if (!suiWallet) {
    throw new Error("Sui wallet not detected. Please install a Sui-compatible wallet.");
  }
  if (!sender || !recipient) {
    throw new Error("Sender and recipient are required for Sui transactions.");
  }

  const mistAmount = BigInt(Math.round(Number(amount) * 1_000_000_000));

  const tx = {
    kind: "moveCall",
    data: {
      packageObjectId: "0x2",
      module: "pay",
      function: "transfer",
      typeArguments: ["0x2::sui::SUI"],
      arguments: [recipient, mistAmount.toString()],
      gasBudget: "2000000"
    }
  };

  const response = await suiWallet.signAndExecuteTransaction?.({ transaction: tx });
  if (!response?.digest) {
    throw new Error("Failed to send Sui transaction");
  }
  return response.digest;
}

export async function waitForSuiTransaction(digest) {
  const response = await fetch(SUI_RPC_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "sui-status",
      method: "sui_getTransactionBlock",
      params: [digest, { showEffects: true, showBalanceChanges: true }]
    })
  });

  const result = await response.json();
  if (result?.error) {
    throw new Error(result.error.message || "Failed to fetch transaction status");
  }
  return result?.result;
}

export async function verifySuiTransaction({ digest, expectedAmount, expectedRecipient }) {
  const tx = await waitForSuiTransaction(digest);
  if (!tx) return false;

  const balanceChanges = tx.balanceChanges || [];
  const matched = balanceChanges.some((change) => {
    const owner = typeof change.owner === "object" ? change.owner.AddressOwner : change.owner;
    if (!owner || owner.toLowerCase() !== expectedRecipient.toLowerCase()) return false;
    const amount = BigInt(change.amount || 0);
    const expectedMist = BigInt(Math.round(Number(expectedAmount) * 1_000_000_000));
    return amount === expectedMist;
  });

  return matched;
}

export function getSuiExplorerLink(digest) {
  return `https://testnet.suivision.xyz/txblock/${digest}`;
}

export default {
  connectSuiWallet,
  sendSuiTransaction,
  waitForSuiTransaction,
  verifySuiTransaction,
  getSuiExplorerLink,
};

