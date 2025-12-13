import { useState, useEffect } from 'react'
import { FaGoogle, FaWallet, FaEthereum, FaBitcoin, FaCheckCircle, FaCopy, FaQrcode, FaHandHoldingHeart, FaHistory, FaChartLine, FaCreditCard } from 'react-icons/fa'
import { TiLocationArrow } from 'react-icons/ti'
import { SiSolana } from 'react-icons/si'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import StripePayment from '../components/StripePayment'
import { useTranslation } from 'react-i18next'
import { statsService, expenseService, investmentService } from '../lib/supabase'
import { validatePaymentAmount } from '../lib/payment'
import { sendTransaction, waitForEthereumTransaction, waitForSolanaTransaction, verifyTransaction } from '../lib/blockchain'
import { createDonationContract } from '../lib/smartContract'
import { processStripeRefund, processCoinbaseRefund, canRefund } from '../lib/refund'

function Donation() {
  const { t } = useTranslation()
  // 인증 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [user, setUser] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')

  // 기부 정보
  const [donationAmount, setDonationAmount] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState('ETH')
  const [paymentMethod, setPaymentMethod] = useState('crypto') // 'crypto' or 'card'
  const [donationHistory, setDonationHistory] = useState([])
  const [isDonating, setIsDonating] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState('')
  const [donationUsage, setDonationUsage] = useState([])
  const [loadingUsage, setLoadingUsage] = useState(true)

  // 실제 기부 주소들
  const donationAddresses = {
    SOL: '2pHWvLfFqnnfAndTdeNkg9Q9C8mbpiuRsFmLanmcjWG3',
    ETH: '0x6EF87606F3AeF06Ee128416595734baDc5B0cA9e',
    BTC: 'bc1qrrzjv6ksqg2n0fwjuuf27695mgkfejm2ag48ed'
  }

  useEffect(() => {
    loadDonationUsage()
    const savedUser = localStorage.getItem('googleUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('googleUser')
      }
    }
  }, [])

  const loadDonationUsage = async () => {
    try {
      setLoadingUsage(true)
      // 기부 사용처 로드 (project_id가 null인 경우 글로벌 기부 사용처)
      const usageData = await expenseService.getExpenses()
      // 글로벌 기부 사용처만 필터링 (실제로는 별도 API 필요)
      setDonationUsage(usageData || [])
    } catch (error) {
      console.error('기부 사용처 로드 실패:', error)
      setDonationUsage([])
    } finally {
      setLoadingUsage(false)
    }
  }

  // Google 로그인
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          }
        )

        const userData = {
          name: userInfoResponse.data.name,
          email: userInfoResponse.data.email,
          picture: userInfoResponse.data.picture || '',
          sub: userInfoResponse.data.sub
        }

        setUser(userData)
        setIsLoggedIn(true)
        localStorage.setItem('googleUser', JSON.stringify(userData))
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        alert(t('common.error'))
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error)
      alert(t('common.error'))
    }
  })

  // 로그아웃
  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setIsWalletConnected(false)
    setWalletAddress('')
    localStorage.removeItem('googleUser')
  }

  // 지갑 연결
  const handleWalletConnect = async (walletType = 'metamask') => {
    if (!isLoggedIn) {
      alert(t('invest.loginRequired'))
      return
    }

    try {
      if (walletType === 'metamask' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        setWalletAddress(accounts[0])
        setIsWalletConnected(true)
      } else if (walletType === 'coinbase') {
        if (window.coinbaseWalletExtension) {
          const accounts = await window.coinbaseWalletExtension.request({
            method: 'eth_requestAccounts'
          })
          setWalletAddress(accounts[0])
          setIsWalletConnected(true)
        } else {
          alert(t('donation.installWallet'))
        }
      } else if (walletType === 'solana') {
        if (window.solana && window.solana.isPhantom) {
          const response = await window.solana.connect()
          setWalletAddress(response.publicKey.toString())
          setIsWalletConnected(true)
        } else {
          alert(t('donation.installWallet'))
        }
      } else {
        alert(t('donation.installWallet'))
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert(t('common.error'))
    }
  }

  // 기부 처리 (암호화폐)
  const handleDonation = async () => {
    if (!donationAmount || !walletAddress) {
      alert(t('donation.checkAmountAndAddress'))
      return
    }

    // 금액 유효성 검사
    const validation = validatePaymentAmount(parseFloat(donationAmount), selectedCrypto, 'coinbase')
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setIsDonating(true)

    try {
      // 기부 주소 가져오기
      const toAddress = donationAddresses[selectedCrypto]
      if (!toAddress) {
        throw new Error('Invalid crypto selection')
      }

      // 네트워크 결정
      const network = selectedCrypto === 'SOL' ? 'solana' : 'ethereum'

      // 실제 블록체인 트랜잭션 전송
      const result = await sendTransaction(
        toAddress,
        parseFloat(donationAmount),
        walletAddress,
        network
      )

      if (!result.success) {
        throw new Error(result.error || 'Transaction failed')
      }

      // 트랜잭션 확인 대기
      let confirmationResult
      if (network === 'solana') {
        confirmationResult = await waitForSolanaTransaction(result.transactionHash)
      } else {
        confirmationResult = await waitForEthereumTransaction(result.transactionHash, 1)
      }

      if (!confirmationResult.success) {
        // 트랜잭션은 전송되었지만 확인 실패 - 나중에 확인 가능하도록 저장
        console.warn('Transaction sent but confirmation failed:', confirmationResult.error)
      }

      // 트랜잭션 검증
      const verification = await verifyTransaction(
        result.transactionHash,
        network,
        parseFloat(donationAmount),
        toAddress
      )

      // 데이터베이스에 저장
      if (user && user.email) {
        await investmentService.createInvestment({
          investor_email: user.email,
          amount: parseFloat(donationAmount),
          crypto_type: selectedCrypto,
          transaction_hash: result.transactionHash,
          status: verification.verified ? 'confirmed' : 'pending',
          investment_date: new Date().toISOString()
        })
      }

      const transaction = {
        id: result.transactionHash,
        amount: parseFloat(donationAmount),
        crypto: selectedCrypto,
        address: walletAddress,
        transactionHash: result.transactionHash,
        timestamp: new Date().toISOString(),
        status: verification.verified ? 'completed' : 'pending',
        verified: verification.verified
      }

      setDonationHistory(prev => [transaction, ...prev])
      setDonationAmount('')
      
      if (verification.verified) {
        alert(t('donation.donationSuccess'))
      } else {
        alert('트랜잭션이 전송되었습니다. 확인 중입니다...')
      }
    } catch (error) {
      console.error('Donation failed:', error)
      alert(error.message || t('donation.donationError'))
    } finally {
      setIsDonating(false)
    }
  }

  // Stripe 결제 성공 처리
  const handleStripeSuccess = async (paymentIntent) => {
    try {
      // Supabase Edge Function을 통해 결제 검증 및 저장
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const verifyResponse = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          investorEmail: user?.email || '',
          cryptoType: 'USD',
        })
      })

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify payment')
      }

      // 데이터베이스에 저장 (백업)
      if (user && user.email) {
        await investmentService.createInvestment({
          investor_email: user.email,
          amount: paymentIntent.amount,
          crypto_type: 'USD',
          transaction_hash: paymentIntent.id,
          status: 'confirmed',
          investment_date: new Date(paymentIntent.created * 1000).toISOString()
        })
      }

      const transaction = {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        method: 'card',
        timestamp: new Date(paymentIntent.created * 1000).toISOString(),
        status: 'completed'
      }

      setDonationHistory(prev => [transaction, ...prev])
      setDonationAmount('')
      alert(t('donation.donationSuccess'))
    } catch (error) {
      console.error('Failed to save payment:', error)
      alert('Payment succeeded but failed to save record. Please contact support.')
    }
  }

  // Stripe 결제 에러 처리
  const handleStripeError = (error) => {
    console.error('Stripe payment error:', error)
    alert(error.message || t('donation.donationError'))
  }

  // 주소 복사
  const copyAddress = async (crypto) => {
    const address = donationAddresses[crypto]
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(crypto)
      setTimeout(() => setCopiedAddress(''), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  const totalDonated = donationHistory.reduce((sum, donation) => sum + parseFloat(donation.amount || 0), 0)
  const donationCount = donationHistory.length

  const getCategoryLabel = (category) => {
    return t(`donation.category.${category}`) || category
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <SEO
        title={t('donation.title') + ' - Global BUSAN'}
        description={t('donation.description')}
        keywords="기부, 부산 기부, 블록체인 기부, 암호화폐 기부, 투명한 기부"
        url="https://globalbusan.xyz/donation"
      />
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-5 sm:px-10">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8">
              {t('donation.title')} <span className="text-blue-300">{t('donation.subtitle')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed mb-12">
              {t('donation.description')}
            </p>
            {/* 기부하기 버튼 */}
            {!isLoggedIn && (
              <button
                onClick={handleGoogleLogin}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-300"
              >
                <TiLocationArrow className="text-xl" />
                {t('donation.donateNow')}
              </button>
            )}
            {isLoggedIn && !isWalletConnected && (
              <button
                onClick={() => {
                  // 지갑 연결 로직은 이미 handleWalletConnect에서 처리됨
                  // 첫 번째 지갑 시도
                  if (window.ethereum) {
                    handleWalletConnect('metamask')
                  } else if (window.solana && window.solana.isPhantom) {
                    handleWalletConnect('solana')
                  } else {
                    alert(t('donation.installWallet'))
                  }
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-300"
              >
                <FaWallet className="text-xl" />
                {t('common.connectWallet')}
              </button>
            )}
          </div>
        </section>

        {/* Google Login */}
        {!isLoggedIn && (
          <section className="py-16">
            <div className="container mx-auto px-5 sm:px-10">
              <div className="max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaGoogle className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{t('invest.loginRequired')}</h3>
                    <p className="text-blue-200 mb-6">{t('donation.loginDescription')}</p>
                    <button
                      onClick={handleGoogleLogin}
                      className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-300 w-full"
                    >
                      {t('common.loginWithGoogle')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Wallet Connection */}
        {isLoggedIn && !isWalletConnected && (
          <section className="py-16">
            <div className="container mx-auto px-5 sm:px-10">
              <div className="max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-green-400"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheckCircle className="text-white text-xl" />
                      </div>
                    )}
                    <p className="text-green-400 font-semibold mb-2">{t('donation.loginCompleted')}</p>
                    <p className="text-white text-sm font-semibold mb-1">{user?.name}</p>
                    <p className="text-blue-200 text-xs">{user?.email}</p>
                    <button
                      onClick={handleLogout}
                      className="mt-3 text-red-400 hover:text-red-300 text-xs underline transition-colors duration-200"
                    >
                      {t('donation.loginDifferentAccount')}
                    </button>
                  </div>

                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaWallet className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">{t('common.connectWallet')}</h3>
                  <p className="text-blue-200 mb-6 text-center">{t('donation.supportedWallets')}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleWalletConnect('metamask')}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors duration-300"
                    >
                      MetaMask
                    </button>
                    <button
                      onClick={() => handleWalletConnect('coinbase')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors duration-300"
                    >
                      Coinbase
                    </button>
                    <button
                      onClick={() => handleWalletConnect('solana')}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors duration-300"
                    >
                      Phantom
                    </button>
                    <button
                      onClick={() => handleWalletConnect('walletconnect')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors duration-300"
                    >
                      WalletConnect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Donation Form */}
        {isLoggedIn && (isWalletConnected || paymentMethod === 'card') && (
          <section className="py-16">
            <div className="container mx-auto px-5 sm:px-10">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-3xl font-bold text-white text-center mb-8">{t('donation.donateNow')}</h3>

                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-3">결제 방법 선택</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          setPaymentMethod('crypto')
                          if (!isWalletConnected) {
                            alert('암호화폐 결제를 위해 지갑을 연결해주세요.')
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          paymentMethod === 'crypto'
                            ? 'border-blue-400 bg-blue-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <FaWallet className="text-2xl text-blue-400 mx-auto mb-2" />
                        <div className="text-white font-semibold">암호화폐</div>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          paymentMethod === 'card'
                            ? 'border-blue-400 bg-blue-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <FaCreditCard className="text-2xl text-green-400 mx-auto mb-2" />
                        <div className="text-white font-semibold">카드 결제</div>
                      </button>
                    </div>
                  </div>

                  {/* Crypto Selection - Only show for crypto payment */}
                  {paymentMethod === 'crypto' && (
                    <>
                      <div className="mb-6">
                        <label className="block text-white font-semibold mb-3">{t('donation.selectCrypto')}</label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { symbol: 'ETH', name: 'Ethereum', icon: FaEthereum, color: 'bg-blue-500' },
                            { symbol: 'BTC', name: 'Bitcoin', icon: FaBitcoin, color: 'bg-orange-500' },
                            { symbol: 'SOL', name: 'Solana', icon: SiSolana, color: 'bg-purple-500' }
                          ].map((crypto) => (
                            <button
                              key={crypto.symbol}
                              onClick={() => setSelectedCrypto(crypto.symbol)}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 ${selectedCrypto === crypto.symbol
                                  ? 'border-blue-400 bg-blue-500/20'
                                  : 'border-white/20 hover:border-white/40'
                                }`}
                            >
                              <crypto.icon className={`text-2xl ${crypto.color.replace('bg-', 'text-')} mx-auto mb-2`} />
                              <div className="text-white font-semibold">{crypto.symbol}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Donation Address */}
                      <div className="mb-6">
                        <label className="block text-white font-semibold mb-3">{t('donation.donationAddress')}</label>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-mono text-sm break-all">
                            {donationAddresses[selectedCrypto]}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => copyAddress(selectedCrypto)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-300"
                            title={t('donation.copyAddress')}
                          >
                            <FaCopy className="text-white text-sm" />
                          </button>
                          <button
                            onClick={() => setShowQRCode(!showQRCode)}
                            className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-300"
                            title={t('donation.viewQRCode')}
                          >
                            <FaQrcode className="text-white text-sm" />
                          </button>
                        </div>
                      </div>
                      {copiedAddress === selectedCrypto && (
                        <p className="text-green-400 text-sm mt-2">{t('donation.addressCopied')}</p>
                      )}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-3">
                      {t('donation.amount')} ({paymentMethod === 'card' ? 'USD' : selectedCrypto})
                    </label>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="0.0"
                      min={paymentMethod === 'card' ? 0.50 : 0}
                      step={paymentMethod === 'card' ? 0.01 : 0.0001}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    />
                    {paymentMethod === 'card' && (
                      <p className="text-blue-200 text-sm mt-2">최소 결제 금액: $0.50</p>
                    )}
                  </div>

                  {/* Payment Form */}
                  {paymentMethod === 'card' ? (
                    donationAmount && parseFloat(donationAmount) >= 0.50 ? (
                      <StripePayment
                        amount={parseFloat(donationAmount)}
                        currency="usd"
                        onSuccess={handleStripeSuccess}
                        onError={handleStripeError}
                        metadata={{
                          name: user?.name || 'Anonymous',
                          email: user?.email || '',
                          type: 'donation',
                          project: 'global-busan'
                        }}
                      />
                    ) : (
                      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-200 text-center">
                        결제 금액을 입력해주세요 (최소 $0.50)
                      </div>
                    )
                  ) : (
                    /* Donate Button for Crypto */
                    <button
                      onClick={handleDonation}
                      disabled={!donationAmount || isDonating}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isDonating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          {t('donation.processing')}
                        </>
                      ) : (
                        <>
                          <TiLocationArrow className="text-xl" />
                          {t('donation.donateNow')}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Donation Usage Section */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-4">{t('donation.usageTitle')}</h2>
              <p className="text-blue-200 text-center mb-12">{t('donation.usageDescription')}</p>

              {loadingUsage ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-blue-200">{t('common.loading')}</p>
                </div>
              ) : donationUsage.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                  <p className="text-blue-200 text-lg">{t('donation.noUsage')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {donationUsage.slice(0, 9).map((usage, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-lg text-sm font-semibold">
                          {getCategoryLabel(usage.category)}
                        </span>
                        <span className="text-green-400 font-bold text-lg">${usage.amount.toLocaleString()}</span>
                      </div>
                      <p className="text-white mb-3">{usage.description}</p>
                      <p className="text-blue-200 text-sm">
                        {new Date(usage.expense_date).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Donation History */}
        {donationHistory.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-5 sm:px-10">
              <div className="max-w-6xl mx-auto">
                <h3 className="text-4xl font-bold text-white text-center mb-12">{t('donation.myDonations')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                    <FaChartLine className="text-4xl text-green-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{totalDonated.toFixed(4)}</div>
                    <div className="text-blue-200">{t('donation.totalDonated')}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                    <FaHistory className="text-4xl text-blue-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{donationCount}</div>
                    <div className="text-blue-200">{t('donation.donationCount')}</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h4 className="text-2xl font-bold text-white mb-6">{t('donation.donationHistory')}</h4>
                  <div className="space-y-4">
                    {donationHistory.map((transaction) => {
                      const refundCheck = canRefund(transaction)
                      const showRefundButton = 
                        transaction.status === 'completed' && 
                        refundCheck.canRefund &&
                        (transaction.method === 'card' || transaction.currency === 'usd')

                      return (
                        <div key={transaction.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="text-white font-semibold">
                                {transaction.amount} {transaction.crypto || transaction.currency?.toUpperCase() || 'USD'}
                              </div>
                              <div className="text-blue-200 text-sm">
                                {new Date(transaction.timestamp).toLocaleString()}
                              </div>
                              {transaction.transactionHash && (
                                <div className="text-gray-400 text-xs mt-1 font-mono">
                                  {transaction.transactionHash.substring(0, 20)}...
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`font-semibold ${
                                transaction.status === 'completed' 
                                  ? 'text-green-400' 
                                  : transaction.status === 'refunded'
                                  ? 'text-red-400'
                                  : 'text-yellow-400'
                              }`}>
                                {transaction.status === 'completed' 
                                  ? t('common.status.completed') 
                                  : transaction.status === 'refunded'
                                  ? '환불됨'
                                  : t('common.status.pending')}
                              </div>
                              {showRefundButton && (
                                <button
                                  onClick={() => handleRefund(transaction)}
                                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-semibold transition-colors duration-200"
                                >
                                  환불
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* QR Code Modal */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm mx-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('donation.qrCode')}</h3>
                <div className="bg-gray-100 rounded-xl p-8 mb-4">
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                    <div className="text-gray-500 text-sm text-center">
                      {t('donation.generatingQRCode')}<br />
                      {t('donation.qrCodePlaceholder')}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{selectedCrypto} {t('donation.scanAddress')}</p>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Donation

