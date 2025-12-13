/**
 * PayPal 결제 컴포넌트
 * 전 세계에서 사용 가능한 PayPal 결제 통합
 */
import { useState, useEffect } from 'react'
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { FaPaypal, FaSpinner, FaCheckCircle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

// PayPal 버튼 컴포넌트
const PayPalButtonWrapper = ({ amount, currency, onSuccess, onError, metadata }) => {
  const [{ isPending }] = usePayPalScriptReducer()
  const { t } = useTranslation()

  const createOrder = async (data, actions) => {
    try {
      // Supabase Edge Function을 통해 PayPal Order 생성
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/functions/v1/create-paypal-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: currency.toUpperCase(),
          metadata: {
            ...metadata,
            platform: 'global-busan',
            timestamp: new Date().toISOString()
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to create PayPal order')
      }

      const { orderId } = await response.json()
      return orderId
    } catch (error) {
      console.error('PayPal order creation error:', error)
      onError?.(error)
      throw error
    }
  }

  const onApprove = async (data, actions) => {
    try {
      // PayPal Order 승인
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/functions/v1/approve-paypal-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          orderID: data.orderID
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to approve PayPal order')
      }

      const orderData = await response.json()

      // 결제 성공 처리
      if (onSuccess) {
        onSuccess({
          id: orderData.order.id,
          amount: parseFloat(amount),
          currency: currency.toUpperCase(),
          status: orderData.order.status,
          payment_method: 'paypal',
          created: new Date().getTime() / 1000,
          payer: orderData.order.payer,
          transaction_id: orderData.order.purchase_units?.[0]?.payments?.captures?.[0]?.id || null
        })
      }
    } catch (error) {
      console.error('PayPal approval error:', error)
      onError?.(error)
    }
  }

  const handleError = (err) => {
    console.error('PayPal button error:', err)
    onError?.(err)
  }

  const onCancel = (data) => {
    console.log('PayPal payment cancelled:', data)
    onError?.(new Error('Payment cancelled by user'))
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <FaSpinner className="animate-spin text-blue-400 text-4xl" />
      </div>
    )
  }

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={handleError}
      onCancel={onCancel}
      style={{
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal'
      }}
    />
  )
}

function PayPalPayment({ amount, currency = 'USD', onSuccess, onError, metadata = {} }) {
  const { t } = useTranslation()
  const [error, setError] = useState(null)

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID

  if (!paypalClientId) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-200">
        {t('paypalPayment.notConfigured') || 'PayPal이 설정되지 않았습니다. VITE_PAYPAL_CLIENT_ID를 환경 변수에 설정해주세요.'}
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        {t('paypalPayment.title') || 'PayPal로 결제하기'}
      </h3>
      <p className="text-blue-200 mb-6 text-center">
        {t('paypalPayment.description') || 'PayPal 계정 또는 카드로 안전하게 결제하세요.'}
      </p>
      
      <div className="mb-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">{t('payment.amount') || '결제 금액'}</span>
            <span className="text-green-400 font-bold text-xl">
              {amount.toLocaleString()} {currency}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-4">
          {error}
        </div>
      )}

      <PayPalScriptProvider
        options={{
          clientId: paypalClientId,
          currency: currency.toUpperCase(),
          intent: 'capture',
          components: 'buttons'
        }}
      >
        <PayPalButtonWrapper
          amount={amount}
          currency={currency}
          onSuccess={onSuccess}
          onError={(err) => {
            setError(err.message || t('payment.error') || '결제에 실패했습니다')
            onError?.(err)
          }}
          metadata={metadata}
        />
      </PayPalScriptProvider>

      <p className="text-xs text-blue-200 mt-4 text-center">
        {t('paypalPayment.securityNote') || '안전한 결제를 위해 PayPal이 결제를 처리합니다.'}
      </p>
    </div>
  )
}

export default PayPalPayment

