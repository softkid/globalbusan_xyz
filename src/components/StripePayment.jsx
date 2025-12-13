import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { FaCreditCard, FaSpinner } from 'react-icons/fa'

// Stripe publishable key (환경 변수에서 가져오기)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
}

const CheckoutForm = ({ amount, currency, onSuccess, onError, metadata }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Payment Intent 생성 (백엔드 API 호출)
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // 센트 단위
          currency: currency.toLowerCase(),
          metadata: {
            ...metadata,
            platform: 'global-busan',
            timestamp: new Date().toISOString()
          }
        })
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError.message || 'Payment intent creation failed')
      }

      // 결제 확인
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: metadata?.name || 'Anonymous',
              email: metadata?.email || '',
            },
          },
        }
      )

      if (confirmError) {
        throw confirmError
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess({
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          payment_method: paymentIntent.payment_method,
          created: paymentIntent.created
        })
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError(err.message || 'Payment failed. Please try again.')
      onError?.(err)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white/10 border border-white/20 rounded-xl p-4">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <FaSpinner className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <FaCreditCard />
            Pay ${amount.toFixed(2)} {currency.toUpperCase()}
          </>
        )}
      </button>
    </form>
  )
}

const StripePayment = ({ amount, currency = 'usd', onSuccess, onError, metadata = {} }) => {
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-200">
        Stripe is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
        metadata={metadata}
      />
    </Elements>
  )
}

export default StripePayment

