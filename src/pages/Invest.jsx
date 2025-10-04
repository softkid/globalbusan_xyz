import { useState, useEffect } from 'react'
import { FaGoogle, FaWallet, FaEthereum, FaBitcoin, FaChartLine, FaHistory, FaCheckCircle } from 'react-icons/fa'
import { TiLocationArrow } from 'react-icons/ti'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Invest() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [user, setUser] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')
  const [donationAmount, setDonationAmount] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState('ETH')
  const [donationHistory, setDonationHistory] = useState([])
  const [isDonating, setIsDonating] = useState(false)

  // Google 로그인
  const handleGoogleLogin = async () => {
    try {
      // Google OAuth 구현 (실제로는 Firebase Auth 사용)
      const mockUser = {
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'https://via.placeholder.com/150'
      }
      setUser(mockUser)
      setIsLoggedIn(true)
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  // 지갑 연결
  const handleWalletConnect = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        setWalletAddress(accounts[0])
        setIsWalletConnected(true)
      } else {
        alert('MetaMask가 설치되지 않았습니다. MetaMask를 설치해주세요.')
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
    }
  }

  // 기부 처리
  const handleDonation = async () => {
    if (!donationAmount || !walletAddress) {
      alert('기부 금액과 지갑 주소를 확인해주세요.')
      return
    }

    setIsDonating(true)
    
    try {
      // 실제로는 스마트 컨트랙트와 상호작용
      const mockTransaction = {
        id: Date.now().toString(),
        amount: donationAmount,
        crypto: selectedCrypto,
        address: walletAddress,
        timestamp: new Date().toISOString(),
        status: 'completed'
      }

      // 기부 기록에 추가
      setDonationHistory(prev => [mockTransaction, ...prev])
      
      // 기부 금액 초기화
      setDonationAmount('')
      
      alert('기부가 성공적으로 완료되었습니다!')
    } catch (error) {
      console.error('Donation failed:', error)
      alert('기부 처리 중 오류가 발생했습니다.')
    } finally {
      setIsDonating(false)
    }
  }

  // 기부 통계 계산
  const totalDonated = donationHistory.reduce((sum, donation) => sum + parseFloat(donation.amount || 0), 0)
  const donationCount = donationHistory.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-5 sm:px-10">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8">
              투자 <span className="text-blue-300">지금 시작하세요</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed mb-12">
              Global BUSAN 프로젝트에 투자하고 부산을 글로벌 비즈니스 허브로 만들어보세요
            </p>
          </div>
        </section>

        {/* Login & Wallet Section */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Google Login */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaGoogle className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Google 로그인</h3>
                    <p className="text-blue-200 mb-6">안전하고 빠른 로그인으로 시작하세요</p>
                    
                    {!isLoggedIn ? (
                      <button
                        onClick={handleGoogleLogin}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-300"
                      >
                        Google로 로그인
                      </button>
                    ) : (
                      <div className="bg-green-500/20 border border-green-500 rounded-xl p-4">
                        <div className="flex items-center justify-center mb-2">
                          <FaCheckCircle className="text-green-400 text-xl mr-2" />
                          <span className="text-green-400 font-semibold">로그인 완료</span>
                        </div>
                        <p className="text-white text-sm">{user?.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Wallet Connection */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaWallet className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">지갑 연결</h3>
                    <p className="text-blue-200 mb-6">MetaMask를 연결하여 투자하세요</p>
                    
                    {!isWalletConnected ? (
                      <button
                        onClick={handleWalletConnect}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-300"
                      >
                        지갑 연결
                      </button>
                    ) : (
                      <div className="bg-green-500/20 border border-green-500 rounded-xl p-4">
                        <div className="flex items-center justify-center mb-2">
                          <FaCheckCircle className="text-green-400 text-xl mr-2" />
                          <span className="text-green-400 font-semibold">지갑 연결됨</span>
                        </div>
                        <p className="text-white text-sm font-mono">{walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Section */}
        {isLoggedIn && isWalletConnected && (
          <section className="py-16">
            <div className="container mx-auto px-5 sm:px-10">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-3xl font-bold text-white text-center mb-8">투자하기</h3>
                  
                  {/* Crypto Selection */}
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-3">암호화폐 선택</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { symbol: 'ETH', name: 'Ethereum', icon: FaEthereum, color: 'bg-blue-500' },
                        { symbol: 'BTC', name: 'Bitcoin', icon: FaBitcoin, color: 'bg-orange-500' }
                      ].map((crypto) => (
                        <button
                          key={crypto.symbol}
                          onClick={() => setSelectedCrypto(crypto.symbol)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedCrypto === crypto.symbol
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

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-3">투자 금액 ({selectedCrypto})</label>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Donate Button */}
                  <button
                    onClick={handleDonation}
                    disabled={!donationAmount || isDonating}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isDonating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        처리 중...
                      </>
                    ) : (
                      <>
                        <TiLocationArrow className="text-xl" />
                        투자하기
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Donation History & Analytics */}
        {donationHistory.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-5 sm:px-10">
              <div className="max-w-6xl mx-auto">
                <h3 className="text-4xl font-bold text-white text-center mb-12">투자 기록 및 분석</h3>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                    <FaChartLine className="text-4xl text-green-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{totalDonated.toFixed(4)}</div>
                    <div className="text-blue-200">총 투자 금액</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                    <FaHistory className="text-4xl text-blue-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{donationCount}</div>
                    <div className="text-blue-200">총 투자 횟수</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                    <FaEthereum className="text-4xl text-purple-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{selectedCrypto}</div>
                    <div className="text-blue-200">주요 투자 코인</div>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h4 className="text-2xl font-bold text-white mb-6">투자 내역</h4>
                  <div className="space-y-4">
                    {donationHistory.map((transaction) => (
                      <div key={transaction.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-white font-semibold">
                              {transaction.amount} {transaction.crypto}
                            </div>
                            <div className="text-blue-200 text-sm">
                              {new Date(transaction.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-green-400 font-semibold">
                            {transaction.status === 'completed' ? '완료' : '처리중'}
                          </div>
                        </div>
                        <div className="text-gray-400 text-sm font-mono mt-2">
                          {transaction.address.slice(0, 20)}...{transaction.address.slice(-20)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Invest
