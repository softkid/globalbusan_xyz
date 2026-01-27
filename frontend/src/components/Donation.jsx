import React, { useState } from 'react'
import { FaHandHoldingHeart, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useSuiWallet } from '../hooks/useSuiWallet'
import { useSuiDonation } from '../hooks/useSuiDonation'
import { buildDonationTransaction, SUI_DONATION_POOL_ID } from '../lib/smartContract'
import { t } from '../lib/i18n'

const Donation = () => {
  const navigate = useNavigate()
  const { connected, address, signAndExecute } = useSuiWallet()
  const { prepareDonation, recordDonation, setError, error, loading } = useSuiDonation()

  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    message: '',
  })
  const [txStatus, setTxStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDonate = async () => {
    if (!connected) {
      alert('Please connect your Sui wallet first')
      return
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid donation amount')
      return
    }

    try {
      setTxStatus({ status: 'preparing', message: 'Preparing transaction...' })

      // Build the transaction
      const tx = prepareDonation(
        address,
        parseFloat(formData.amount),
        formData.donorName,
        formData.message
      )

      if (!tx) {
        throw new Error('Failed to prepare transaction')
      }

      setTxStatus({ status: 'signing', message: 'Please sign the transaction in your wallet...' })

      // Sign and execute
      const result = await signAndExecute(tx)

      if (result?.digest) {
        setTxStatus({ 
          status: 'success', 
          message: `Transaction successful! Digest: ${result.digest.substring(0, 10)}...` 
        })

        // Record donation
        recordDonation({
          amount: formData.amount,
          donor: formData.donorName || 'Anonymous',
          message: formData.message,
          txDigest: result.digest,
          address: address,
        })

        // Reset form
        setFormData({
          amount: '',
          donorName: '',
          message: '',
        })

        // Auto-reset status after 5 seconds
        setTimeout(() => setTxStatus(null), 5000)
      }
    } catch (err) {
      setTxStatus({ 
        status: 'error', 
        message: err.message || 'Transaction failed' 
      })
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24">
      <div className="container mx-auto px-5 sm:px-10 pb-20">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-10 transition-colors"
        >
          <FaArrowLeft />
          Back to Home
        </button>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <FaHandHoldingHeart className="text-white text-4xl" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              {t('donation.title') || 'Make a Donation'}
            </h1>
            <p className="text-xl text-blue-200">
              {t('donation.subtitle') || 'Support our mission with a contribution'}
            </p>
          </div>

          {/* Wallet Status */}
          {!connected && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg mb-8">
              <p className="font-semibold">Please connect your Sui wallet to continue</p>
              <p className="text-sm">Use the Connect Wallet button in the header</p>
            </div>
          )}

          {/* Donation Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            {/* Amount */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Amount (SUI)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter donation amount"
                step="0.01"
                min="0"
                disabled={!connected || loading}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
              />
              <p className="text-blue-200 text-sm mt-1">Minimum: 0.01 SUI</p>
            </div>

            {/* Donor Name */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                name="donorName"
                value={formData.donorName}
                onChange={handleInputChange}
                placeholder="Enter your name or leave blank for anonymous"
                disabled={!connected || loading}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Message */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-2">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Leave a message of support"
                rows="4"
                disabled={!connected || loading}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-colors resize-none disabled:opacity-50"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <FaExclamationCircle />
                {error}
              </div>
            )}

            {/* Transaction Status */}
            {txStatus && (
              <div className={`px-4 py-3 rounded-lg mb-6 flex items-center gap-2 ${
                txStatus.status === 'success' 
                  ? 'bg-green-100 border border-green-400 text-green-800' 
                  : txStatus.status === 'error'
                  ? 'bg-red-100 border border-red-400 text-red-800'
                  : 'bg-blue-100 border border-blue-400 text-blue-800'
              }`}>
                {txStatus.status === 'success' && <FaCheckCircle />}
                {txStatus.status === 'error' && <FaExclamationCircle />}
                {txStatus.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleDonate}
              disabled={!connected || !formData.amount || loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaHandHoldingHeart />
              {loading ? 'Processing...' : 'Donate Now'}
            </button>

            {/* Info */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <h3 className="text-white font-semibold mb-4">Why Donate?</h3>
              <ul className="space-y-3 text-blue-200 text-sm">
                <li>✓ Secure blockchain-based donations</li>
                <li>✓ Transparent fund tracking on Sui testnet</li>
                <li>✓ Your donation supports Global Busan development</li>
                <li>✓ Real-time confirmation on-chain</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Donation
