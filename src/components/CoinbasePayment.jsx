import { useState, useEffect } from 'react'
import { FaBitcoin, FaEthereum, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa'
import { SiSolana } from 'react-icons/si'
import { processCoinbasePayment, checkPaymentStatus } from '../lib/payment'
import { useTranslation } from 'react-i18next'

/**
 * Coinbase Commerce 결제 컴포넌트
 */
function CoinbasePayment({ amount, currency = 'USD', onSuccess, onError, metadata = {} }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [charge, setCharge] = useState(null)
  const [error, setError] = useState(null)
  const [checkingStatus, setCheckingStatus] = useState(false)

  // 지원되는 암호화폐
  const supportedCryptos = [
    { code: 'BTC', name: 'Bitcoin', icon: FaBitcoin },
    { code: 'ETH', name: 'Ethereum', icon: FaEthereum },
    { code: 'SOL', name: 'Solana', icon: SiSolana },
    { code: 'USDC', name: 'USD Coin', icon: FaBitcoin },
  ]

  // Charge 생성
  const handleCreateCharge = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await processCoinbasePayment(amount, currency, metadata)
      
      if (result.charge) {
        setCharge(result.charge)
        // 호스팅된 URL로 리다이렉트
        if (result.hosted_url) {
          window.location.href = result.hosted_url
        }
      } else {
        throw new Error('Failed to create charge')
      }
    } catch (err) {
      const errorMessage = err.message || t('payment.error') || 'Payment failed'
      setError(errorMessage)
      if (onError) {
        onError(err)
      }
    } finally {
      setLoading(false)
    }
  }

  // 결제 상태 확인 (polling)
  useEffect(() => {
    if (!charge?.code) return

    const interval = setInterval(async () => {
      try {
        setCheckingStatus(true)
        const status = await checkPaymentStatus(charge.code, 'coinbase')
        
        if (status.status === 'COMPLETED' || status.status === 'CONFIRMED') {
          clearInterval(interval)
          if (onSuccess) {
            onSuccess({
              chargeId: charge.code,
              status: status.status,
              charge: status.charge
            })
          }
        } else if (status.status === 'EXPIRED' || status.status === 'CANCELED') {
          clearInterval(interval)
          if (onError) {
            onError(new Error('Payment was canceled or expired'))
          }
        }
      } catch (err) {
        console.error('Error checking payment status:', err)
      } finally {
        setCheckingStatus(false)
      }
    }, 5000) // 5초마다 확인

    return () => clearInterval(interval)
  }, [charge, onSuccess, onError])

  if (charge?.hosted_url) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg mb-4">
            {t('payment.redirecting') || 'Redirecting to payment page...'}
          </p>
          <a
            href={charge.hosted_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline flex items-center justify-center gap-2"
          >
            {t('payment.openPaymentPage') || 'Open Payment Page'}
            <FaExternalLinkAlt />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">
        {t('payment.cryptoPayment') || 'Cryptocurrency Payment'}
      </h3>
      
      <div className="mb-6">
        <p className="text-blue-200 mb-4">
          {t('payment.coinbaseDescription') || 'Pay with cryptocurrency using Coinbase Commerce'}
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {supportedCryptos.map((crypto) => {
            const Icon = crypto.icon
            return (
              <div
                key={crypto.code}
                className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-blue-400 transition-colors"
              >
                <Icon className="text-2xl text-blue-400 mb-2" />
                <p className="text-white text-sm font-semibold">{crypto.name}</p>
                <p className="text-blue-200 text-xs">{crypto.code}</p>
              </div>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 text-red-200">
          {error}
        </div>
      )}

      <button
        onClick={handleCreateCharge}
        disabled={loading || checkingStatus}
        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
      >
        {loading || checkingStatus ? (
          <>
            <FaSpinner className="animate-spin" />
            {t('payment.processing') || 'Processing...'}
          </>
        ) : (
          <>
            <FaBitcoin />
            {t('payment.payWithCrypto') || `Pay ${amount} ${currency}`}
          </>
        )}
      </button>

      <p className="text-xs text-blue-200 mt-4 text-center">
        {t('payment.coinbaseSecure') || 'Secure payment powered by Coinbase Commerce'}
      </p>
    </div>
  )
}

export default CoinbasePayment

