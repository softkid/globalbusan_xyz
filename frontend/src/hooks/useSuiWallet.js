import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing Sui wallet connections
 * Integrates with Sui Wallet or other Sui-compatible wallets
 */
export function useSuiWallet() {
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wallet, setWallet] = useState(null);

  /**
   * Check if wallet is available and connect if previously connected
   */
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = useCallback(async () => {
    try {
      // Check if Sui Wallet is available
      if (window?.suiWallet) {
        const wallet = window.suiWallet;
        setWallet(wallet);

        // Try to get connected account
        try {
          const accounts = await wallet.getAccounts?.();
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0].address);
            setConnected(true);
          }
        } catch (err) {
          // Wallet not connected yet
          setConnected(false);
        }
      } else {
        setError('Sui Wallet extension not found');
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
      setError(err.message);
    }
  }, []);

  /**
   * Connect to wallet
   */
  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window?.suiWallet) {
        throw new Error('Sui Wallet extension not found. Please install it.');
      }

      const wallet = window.suiWallet;
      const accounts = await wallet.requestPermissions?.();

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0].address);
        setConnected(true);
        setWallet(wallet);
      }
    } catch (err) {
      setError(err.message);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Disconnect from wallet
   */
  const disconnect = useCallback(() => {
    setAddress(null);
    setConnected(false);
    setWallet(null);
    setError(null);
  }, []);

  /**
   * Sign and execute transaction
   * @param {TransactionBlock} txBlock - Transaction to sign
   * @returns {Promise<object>} - Transaction result with digest
   */
  const signAndExecute = useCallback(
    async (txBlock) => {
      if (!wallet || !connected) {
        throw new Error('Wallet not connected');
      }

      try {
        setLoading(true);
        setError(null);

        // Set gas budget if not already set
        if (!txBlock.gasData || txBlock.gasData.budget === undefined) {
          txBlock.setGasBudget(10000000); // 0.01 SUI
        }

        // Sign and execute transaction
        const result = await wallet.signAndExecuteTransactionBlock?.({
          transactionBlock: txBlock,
          options: {
            showObjectChanges: true,
            showEffects: true,
          },
        });

        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [wallet, connected]
  );

  /**
   * Get wallet balance
   * @returns {Promise<string>} - Balance in MIST
   */
  const getBalance = useCallback(async () => {
    if (!wallet || !connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await wallet.getBalance?.();
      return balance;
    } catch (err) {
      console.error('Error getting balance:', err);
      throw err;
    }
  }, [wallet, connected]);

  return {
    address,
    connected,
    loading,
    error,
    wallet,
    connect,
    disconnect,
    signAndExecute,
    getBalance,
    checkWalletConnection,
  };
}

export default useSuiWallet;
