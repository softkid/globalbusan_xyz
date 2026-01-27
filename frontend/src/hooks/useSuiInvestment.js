import { useState, useCallback } from 'react';
import { buildInvestmentTransaction, buildCreateProjectTransaction, mistToSui, suiToMist } from '../lib/smartContract';

/**
 * Hook for managing Sui investments
 * Handles transaction building and investment management
 */
export function useSuiInvestment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gasEstimate, setGasEstimate] = useState(null);
  const [txDigest, setTxDigest] = useState(null);

  /**
   * Prepare investment transaction
   * @param {string} projectId - Investment project object ID
   * @param {string} investorAddress - Investor wallet address
   * @param {number} suiAmount - Amount in SUI tokens
   * @param {number} shares - Number of shares to purchase
   * @returns {TransactionBlock} - Ready to sign
   */
  const prepareInvestment = useCallback((projectId, investorAddress, suiAmount, shares) => {
    try {
      setError(null);
      const mistAmount = suiToMist(suiAmount);
      
      if (mistAmount <= 0 || shares <= 0) {
        throw new Error('Invalid investment amount or shares');
      }
      
      if (!projectId || projectId === '0x0') {
        throw new Error('Project ID not available');
      }
      
      return buildInvestmentTransaction(projectId, investorAddress, mistAmount, shares);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  /**
   * Prepare project creation transaction
   * @param {string} name - Project name
   * @param {string} description - Project description
   * @param {number} suiGoal - Goal amount in SUI
   * @param {number} sharesCount - Total shares count
   * @returns {TransactionBlock} - Ready to sign
   */
  const prepareCreateProject = useCallback((name, description, suiGoal, sharesCount) => {
    try {
      setError(null);
      
      if (!name || !description) {
        throw new Error('Project name and description are required');
      }
      
      if (suiGoal <= 0 || sharesCount <= 0) {
        throw new Error('Invalid goal amount or shares count');
      }
      
      const mistGoal = suiToMist(suiGoal);
      return buildCreateProjectTransaction(name, description, mistGoal, sharesCount);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  /**
   * Record successful investment to local storage
   * @param {object} investmentData - Investment information
   */
  const recordInvestment = useCallback((investmentData) => {
    try {
      const investments = JSON.parse(localStorage.getItem('sui_investments') || '[]');
      investments.push({
        ...investmentData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('sui_investments', JSON.stringify(investments));
    } catch (err) {
      console.error('Error recording investment:', err);
    }
  }, []);

  /**
   * Get investment history from local storage
   * @returns {Array} - List of investments
   */
  const getInvestmentHistory = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('sui_investments') || '[]');
    } catch (err) {
      console.error('Error getting investment history:', err);
      return [];
    }
  }, []);

  /**
   * Calculate ROI for an investment
   * @param {object} investment - Investment object
   * @param {number} currentValue - Current value in SUI
   * @returns {object} - ROI information
   */
  const calculateROI = useCallback((investment, currentValue) => {
    const initialInvestment = investment.amount;
    const profit = currentValue - initialInvestment;
    const roiPercent = ((profit / initialInvestment) * 100).toFixed(2);
    
    return {
      initialInvestment,
      currentValue,
      profit,
      roiPercent,
    };
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
    prepareInvestment,
    prepareCreateProject,
    recordInvestment,
    getInvestmentHistory,
    calculateROI,
    mistToSui,
    suiToMist,
  };
}

export default useSuiInvestment;
