import { useState, useCallback } from 'react';
import { buildDonationTransaction, mistToSui, suiToMist } from '../lib/smartContract';

/**
 * Hook for managing Sui donations
 * Handles transaction building, fee estimation, and progress tracking
 */
export function useSuiDonation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gasEstimate, setGasEstimate] = useState(null);
  const [txDigest, setTxDigest] = useState(null);

  /**
   * Prepare donation transaction (without signing)
   * @param {string} donorAddress - Donor wallet address
   * @param {number} suiAmount - Amount in SUI tokens
   * @param {string} donorName - Optional donor name
   * @param {string} message - Optional donation message
   * @returns {TransactionBlock} - Ready to sign
   */
  const prepareDonation = useCallback((donorAddress, suiAmount, donorName = '', message = '') => {
    try {
      setError(null);
      const mistAmount = suiToMist(suiAmount);
      
      if (mistAmount <= 0) {
        throw new Error('Invalid donation amount');
      }
      
      return buildDonationTransaction(donorAddress, mistAmount, donorName, message);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  /**
   * Record successful donation to local storage
   * @param {object} donationData - Donation information
   */
  const recordDonation = useCallback((donationData) => {
    try {
      const donations = JSON.parse(localStorage.getItem('sui_donations') || '[]');
      donations.push({
        ...donationData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('sui_donations', JSON.stringify(donations));
    } catch (err) {
      console.error('Error recording donation:', err);
    }
  }, []);

  /**
   * Get donation history from local storage
   * @returns {Array} - List of donations
   */
  const getDonationHistory = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('sui_donations') || '[]');
    } catch (err) {
      console.error('Error getting donation history:', err);
      return [];
    }
  }, []);

  return {
    loading,
    setLoading,
    error,
    setError,
    gasEstimate,
    setGasEstimate,
    txDigest,
    setTxDigest,
    prepareDonation,
    recordDonation,
    getDonationHistory,
    mistToSui,
    suiToMist,
  };
}

export default useSuiDonation;
