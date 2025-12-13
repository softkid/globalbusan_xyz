/**
 * 토스페이먼츠 결제 컴포넌트
 * 한국에서 사용 가능한 카드 및 간편결제 통합
 */
import { useState, useEffect } from 'react'
import { FaCreditCard, FaSpinner, FaCheckCircle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

// 토스페이먼츠 SDK 동적 로드
const loadTossPayments = () => {
  return new Promise((resolve, reject) => {
    if (window.TossPayments) {
      resolve(window.TossPayments)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v2/payment'
    script.async = true
    script.onload = () => resolve(window.TossPayments)
    script.onerror = () => reject(new Error('Failed to load Toss Payments SDK'))
    document.head.appendChild(script)
  })
}

function TossPayment({ amount, currency = 'KRW', onSuccess, onError, metadata = {} }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tossPayments, setTossPayments] = useState(null)

  useEffect(() => {
    const initTossPayments = async () => {
      try {
        const TossPayments = await loadTossPayments()
        const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY
        if (!clientKey) {
          setError('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.')
          return
        }
        // 토스페이먼츠 SDK 초기화 (결제창 사용)
        const instance = TossPayments(clientKey)
        setTossPayments(instance)
      } catch (err) {
        console.error('Failed to initialize Toss Payments:', err)
        setError('토스페이먼츠 SDK 로드 실패')
      }
    }

    initTossPayments()
  }, [])

  const handlePayment = async () => {
    if (!tossPayments) {
      setError('토스페이먼츠가 초기화되지 않았습니다.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 주문번호 생성 (고유한 값)
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // 결제창 인스턴스 생성 및 결제 요청
      const payment = tossPayments.payment()
      
      // 결제창 열기 (통합결제창 - 카드/간편결제 선택 가능)
      await payment.requestPayment('CARD', {
        amount: {
          value: Math.round(amount), // 원 단위
          currency: 'KRW'
        },
        orderId: orderId,
        orderName: metadata.orderName || 'Global BUSAN 기부',
        customerName: metadata.name || 'Anonymous',
        customerEmail: metadata.email || '',
        successUrl: `${window.location.origin}/donation/success?orderId=${orderId}`,
        failUrl: `${window.location.origin}/donation/fail?orderId=${orderId}`,
        metadata: {
          ...metadata,
          platform: 'global-busan',
          timestamp: new Date().toISOString()
        }
      })

      // 결제창이 열리면 리다이렉트되므로 여기서는 대기
      // 실제 결제 승인은 successUrl에서 처리
    } catch (err) {
      console.error('Toss payment error:', err)
      const errorMessage = err.message || t('payment.error') || '결제에 실패했습니다'
      setError(errorMessage)
      if (onError) {
        onError(err)
      }
      setLoading(false)
    }
  }

  // 결제 성공 페이지에서 호출되는 승인 함수
  const approvePayment = async (paymentKey, orderId, amount) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/functions/v1/approve-toss-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: parseInt(amount)
        })
      })

      if (!response.ok) {
        throw new Error('Payment approval failed')
      }

      const data = await response.json()
      
      if (onSuccess) {
        onSuccess({
          id: data.payment.paymentKey,
          amount: data.payment.totalAmount / 100, // 원 단위로 변환
          currency: 'KRW',
          status: 'succeeded',
          payment_method: 'toss_payments',
          created: new Date(data.payment.approvedAt).getTime() / 1000,
          orderId: data.payment.orderId
        })
      }
    } catch (err) {
      console.error('Payment approval error:', err)
      if (onError) {
        onError(err)
      }
    }
  }

  if (!import.meta.env.VITE_TOSS_CLIENT_KEY) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-200">
        {t('tossPayment.notConfigured') || '토스페이먼츠가 설정되지 않았습니다. VITE_TOSS_CLIENT_KEY를 환경 변수에 설정해주세요.'}
      </div>
    )
  }

  if (error && !loading) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
        {error}
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        {t('tossPayment.title') || '토스페이먼츠로 결제하기'}
      </h3>
      <p className="text-blue-200 mb-6 text-center">
        {t('tossPayment.description') || '카드, 계좌이체, 가상계좌 등 다양한 결제수단을 지원합니다.'}
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

      <button
        onClick={handlePayment}
        disabled={loading || !tossPayments}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            {t('common.loading') || '처리 중...'}
          </>
        ) : (
          <>
            <FaCreditCard />
            {t('tossPayment.payNow') || `${amount.toLocaleString()}원 결제하기`}
          </>
        )}
      </button>

      <p className="text-xs text-blue-200 mt-4 text-center">
        {t('tossPayment.securityNote') || '안전한 결제를 위해 토스페이먼츠가 결제를 처리합니다.'}
      </p>
    </div>
  )
}

// 결제 성공 페이지에서 사용할 수 있는 승인 함수 export
export const approveTossPayment = async (paymentKey, orderId, amount) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const response = await fetch(`${supabaseUrl}/functions/v1/approve-toss-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount: parseInt(amount)
    })
  })

  if (!response.ok) {
    throw new Error('Payment approval failed')
  }

  return response.json()
}

export default TossPayment

