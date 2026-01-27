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
      // Try multiple Sui wallet interfaces
      let wallet = null;
      const walletInterfaces = [
        { name: '__SUIX__', key: '__SUIX__' },
        { name: 'suiWallet', key: 'suiWallet' },
        { name: 'sui', key: 'sui' }
      ];

      for (const { name, key } of walletInterfaces) {
        if (window?.[key]) {
          wallet = window[key];
          console.log(`Found Sui wallet at window.${name}`);
          setWallet(wallet);
          break;
        }
      }

      if (!wallet) {
        console.warn('No Sui wallet detected. Available window keys:', Object.keys(window).filter(k => k.includes('sui') || k.includes('wallet')));
        setError('Sui Wallet extension not found');
        return;
      }

      // Try to get connected account
      try {
        const accounts = await wallet.getAccounts?.();
        if (accounts && accounts.length > 0) {
          const accountAddr = accounts[0]?.address || accounts[0];
          setAddress(accountAddr);
          setConnected(true);
          console.log('Wallet already connected:', accountAddr);
        }
      } catch (err) {
        // Wallet not connected yet
        console.log('Wallet not yet connected:', err.message);
        setConnected(false);
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

      // Try multiple Sui wallet interfaces
      let wallet = null;
      const walletInterfaces = [
        { name: '__SUIX__', key: '__SUIX__' },
        { name: 'suiWallet', key: 'suiWallet' },
        { name: 'sui', key: 'sui' }
      ];

      for (const { name, key } of walletInterfaces) {
        if (window?.[key]) {
          wallet = window[key];
          console.log(`Attempting to connect via window.${name}`);
          setWallet(wallet);
          break;
        }
      }

      if (!wallet) {
        const availableKeys = Object.keys(window).filter(k => k.includes('sui') || k.includes('wallet')).join(', ');
        throw new Error(`Sui Wallet extension not found. Available: ${availableKeys || 'none'}. Please install a Sui-compatible wallet.`);
      }

      // Request permissions first
      if (typeof wallet.requestPermissions === 'function') {
        await wallet.requestPermissions({ permissions: ['viewAccount', 'suggestTransactions'] });
      }

      const accounts = await wallet.getAccounts?.();

      if (accounts && accounts.length > 0) {
        const accountAddr = accounts[0]?.address || accounts[0];
        setAddress(accountAddr);
        setConnected(true);
        console.log('Wallet connected successfully:', accountAddr);
      } else {
        throw new Error('No accounts found in wallet');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
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
