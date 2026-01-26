import { useState, useEffect } from 'react'
import { FaGoogle, FaWallet, FaCheckCircle, FaCopy, FaQrcode, FaHandHoldingHeart, FaHistory, FaChartLine } from 'react-icons/fa'
import { TiLocationArrow } from 'react-icons/ti'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { useTranslation } from 'react-i18next'
import { statsService, expenseService, investmentService } from '../lib/supabase'
import { validatePaymentAmount } from '../lib/payment'
import { sendSuiTransaction, waitForSuiTransaction, verifySuiTransaction, connectSuiWallet } from '../lib/blockchain'

function Donation() {
  const { t } = useTranslation()
  
  // Structured Data for Donation Page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    "name": "Global BUSAN Donation",
    "description": t('donation.description') || "투명한 블록체인 기반 기부 플랫폼을 통해 부산의 글로벌 비즈니스 허브 구축을 지원하세요",
    "recipient": {
      "@type": "Organization",
      "name": "Global BUSAN",
      "url": "https://globalbusan.xyz"
    },
    "paymentMethod": ["Sui"],
    "url": "https://globalbusan.xyz/donation"
  }
  
  // 인증 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [user, setUser] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')

  // 기부 정보
  const [donationAmount, setDonationAmount] = useState('')
  const [donationHistory, setDonationHistory] = useState([])
  const [isDonating, setIsDonating] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState('')
  const [donationUsage, setDonationUsage] = useState([])
  const [loadingUsage, setLoadingUsage] = useState(true)

  // Sui 테스트넷 기부 주소 (Move 컨트랙트 혹은 수령 계정)
  const donationAddress = '0x6ef87606f3aef06ee128416595734badc5b0ca9e000000000000000000000000'

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

  // 지갑 연결 (Sui 전용)
  const handleWalletConnect = async () => {
    if (!isLoggedIn) {
      alert(t('invest.loginRequired'))
      return
    }

    try {
      const address = await connectSuiWallet()
      setWalletAddress(address)
      setIsWalletConnected(true)
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert(error.message || t('donation.installWallet'))
    }
  }

  // 기부 처리 (Sui)
  const handleDonation = async () => {
    if (!donationAmount || !walletAddress) {
      alert(t('donation.checkAmountAndAddress'))
      return
    }

    const validation = validatePaymentAmount(parseFloat(donationAmount), 'SUI')
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setIsDonating(true)

    try {
      const txDigest = await sendSuiTransaction({
        sender: walletAddress,
        recipient: donationAddress,
        amount: parseFloat(donationAmount)
      })

      // 상태 확인 (검증을 위해 RPC 조회)
      await waitForSuiTransaction(txDigest)
      const verified = await verifySuiTransaction({
        digest: txDigest,
        expectedAmount: parseFloat(donationAmount),
        expectedRecipient: donationAddress
      })

      if (user && user.email) {
        await investmentService.createInvestment({
          investor_email: user.email,
          amount: parseFloat(donationAmount),
          crypto_type: 'SUI',
          transaction_hash: txDigest,
          status: verified ? 'confirmed' : 'pending',
          investment_date: new Date().toISOString()
        })
      }

      const transaction = {
        id: txDigest,
        amount: parseFloat(donationAmount),
        crypto: 'SUI',
        address: walletAddress,
        transactionHash: txDigest,
        timestamp: new Date().toISOString(),
        status: verified ? 'completed' : 'pending',
        verified
      }

      setDonationHistory(prev => [transaction, ...prev])
      setDonationAmount('')
      
      if (verified) {
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

  // 주소 복사
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(donationAddress)
      setCopiedAddress('SUI')
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
        structuredData={structuredData}
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
                onClick={handleWalletConnect}
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
                  <p className="text-blue-200 mb-6 text-center">Sui 호환 지갑(예: Ethos, Sui Wallet)을 연결해주세요.</p>

                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={handleWalletConnect}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors duration-300"
                    >
                      Connect Sui Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Donation Form (Sui 전용) */}
        {isLoggedIn && isWalletConnected && (
          <section className="py-16">
            <div className="container mx-auto px-5 sm:px-10">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-3xl font-bold text-white text-center mb-8">{t('donation.donateNow')}</h3>

                  {/* Sui 전용 정보 */}
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-3">Sui Testnet</label>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 rounded-xl border-2 border-blue-400 bg-blue-500/20 flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold">SUI</div>
                          <div className="text-blue-200 text-sm">Sui Testnet · Move 기반 기부</div>
                        </div>
                        <FaWallet className="text-2xl text-blue-300" />
                      </div>
                    </div>
                  </div>

                  {/* Donation Address */}
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-3">{t('donation.donationAddress')}</label>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-mono text-sm break-all">
                            {donationAddress}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={copyAddress}
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
                      {copiedAddress === 'SUI' && (
                        <p className="text-green-400 text-sm mt-2">{t('donation.addressCopied')}</p>
                      )}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-3">
                      {t('donation.amount')} (SUI)
                    </label>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="0.0"
                      min={0}
                      step={0.0001}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Donate Button for Sui */}
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
                    {donationHistory.map((transaction) => (
                      <div key={transaction.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="text-white font-semibold">
                              {transaction.amount} {transaction.crypto || 'SUI'}
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
                          </div>
                        </div>
                      </div>
                    ))}
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
                <p className="text-gray-600 mb-4">SUI {t('donation.scanAddress')}</p>
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

