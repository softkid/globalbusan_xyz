import { useState, useEffect } from 'react'
import { FaGoogle, FaWallet, FaEthereum, FaBitcoin, FaChartLine, FaHistory, FaCheckCircle, FaCopy, FaQrcode, FaBuilding, FaHandHoldingHeart } from 'react-icons/fa'
import { TiLocationArrow } from 'react-icons/ti'
import { SiSolana } from 'react-icons/si'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Invest() {
  // 인증 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [user, setUser] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')
  
  // 투자 타입: 'global' (글로벌부산 기부) 또는 'project' (프로젝트 투자)
  const [investmentType, setInvestmentType] = useState('global')
  
  // 투자 정보
  const [donationAmount, setDonationAmount] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState('ETH')
  const [selectedProject, setSelectedProject] = useState(null)
  const [donationHistory, setDonationHistory] = useState([])
  const [isDonating, setIsDonating] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState('')

  // 실제 기부 주소들 (글로벌부산 기부용)
  const globalDonationAddresses = {
    SOL: '2pHWvLfFqnnfAndTdeNkg9Q9C8mbpiuRsFmLanmcjWG3',
    ETH: '0x6EF87606F3AeF06Ee128416595734baDc5B0cA9e',
    BTC: 'bc1qrrzjv6ksqg2n0fwjuuf27695mgkfejm2ag48ed'
  }

  // 프로젝트 목록 (실제로는 API에서 가져옴)
  const [projects, setProjects] = useState([])
  
  useEffect(() => {
    // 프로젝트 목록 로드 (실제로는 API 호출)
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      // 실제로는 projectService.getProjects() 호출
      const mockProjects = [
        { id: 1, title: '부산 글로벌 비즈니스 허브 플랫폼', donationAddress: '0x1234...5678' },
        { id: 2, title: '블록체인 기반 투명성 시스템', donationAddress: '0x2345...6789' }
      ]
      setProjects(mockProjects)
    } catch (error) {
      console.error('프로젝트 로드 실패:', error)
    }
  }

  // Google 로그인
  const handleGoogleLogin = async () => {
    try {
      // Google OAuth 구현 (실제로는 Firebase Auth 또는 Supabase Auth 사용)
      const mockUser = {
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'https://via.placeholder.com/150'
      }
      setUser(mockUser)
      setIsLoggedIn(true)
    } catch (error) {
      console.error('Google login failed:', error)
      alert('Google 로그인에 실패했습니다.')
    }
  }

  // 지갑 연결 (다중 지갑 지원)
  const handleWalletConnect = async (walletType = 'metamask') => {
    if (!isLoggedIn) {
      alert('먼저 Google 로그인을 완료해주세요.')
      return
    }

    try {
      if (walletType === 'metamask' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        setWalletAddress(accounts[0])
        setIsWalletConnected(true)
      } else if (walletType === 'walletconnect') {
        alert('WalletConnect는 곧 지원될 예정입니다.')
      } else if (walletType === 'coinbase') {
        if (window.coinbaseWalletExtension) {
          const accounts = await window.coinbaseWalletExtension.request({
            method: 'eth_requestAccounts'
          })
          setWalletAddress(accounts[0])
          setIsWalletConnected(true)
        } else {
          alert('Coinbase Wallet이 설치되지 않았습니다.')
        }
      } else if (walletType === 'solana') {
        if (window.solana && window.solana.isPhantom) {
          const response = await window.solana.connect()
          setWalletAddress(response.publicKey.toString())
          setIsWalletConnected(true)
        } else {
          alert('Phantom 지갑이 설치되지 않았습니다.')
        }
      } else {
        alert('지갑이 설치되지 않았습니다. MetaMask, Coinbase Wallet, 또는 Phantom을 설치해주세요.')
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert('지갑 연결에 실패했습니다.')
    }
  }

  // 투자 처리
  const handleInvestment = async () => {
    if (!donationAmount || !walletAddress) {
      alert('투자 금액과 지갑 주소를 확인해주세요.')
      return
    }

    if (investmentType === 'project' && !selectedProject) {
      alert('투자할 프로젝트를 선택해주세요.')
      return
    }

    setIsDonating(true)
    
    try {
      // 실제로는 스마트 컨트랙트와 상호작용
      const mockTransaction = {
        id: Date.now().toString(),
        type: investmentType,
        amount: donationAmount,
        crypto: selectedCrypto,
        address: walletAddress,
        project: selectedProject,
        timestamp: new Date().toISOString(),
        status: 'completed'
      }

      // 투자 기록에 추가
      setDonationHistory(prev => [mockTransaction, ...prev])
      
      // 투자 금액 초기화
      setDonationAmount('')
      setSelectedProject(null)
      
      alert(`${investmentType === 'global' ? '글로벌부산 기부' : '프로젝트 투자'}가 성공적으로 완료되었습니다!`)
    } catch (error) {
      console.error('Investment failed:', error)
      alert('투자 처리 중 오류가 발생했습니다.')
    } finally {
      setIsDonating(false)
    }
  }

  // 주소 복사 기능
  const copyAddress = async (crypto) => {
    const address = investmentType === 'global' 
      ? globalDonationAddresses[crypto]
      : selectedProject?.donationAddress || ''
    
    if (!address) {
      alert('주소를 선택해주세요.')
      return
    }

    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(crypto)
      setTimeout(() => setCopiedAddress(''), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  // 투자 통계 계산
  const totalInvested = donationHistory.reduce((sum, donation) => sum + parseFloat(donation.amount || 0), 0)
  const investmentCount = donationHistory.length

  // 현재 사용 가능한 주소
  const getCurrentAddress = () => {
    if (investmentType === 'global') {
      return globalDonationAddresses[selectedCrypto]
    } else {
      return selectedProject?.donationAddress || ''
    }
  }

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

        {/* Step 1: Google Login */}
        {!isLoggedIn && (
          <section className="py-16">
            <div className="container mx-auto px-5 sm:px-10">
              <div className="max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaGoogle className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">먼저 로그인하세요</h3>
                    <p className="text-blue-200 mb-6">안전하고 빠른 Google 로그인으로 시작하세요</p>
                    
                    <button
                      onClick={handleGoogleLogin}
                      className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-300 w-full"
                    >
                      Google로 로그인
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Wallet Connection (로그인 후에만 표시) */}
        {isLoggedIn && !isWalletConnected && (
          <section className="py-16">
            <div className="container mx-auto px-5 sm:px-10">
              <div className="max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="text-white text-xl" />
                    </div>
                    <p className="text-green-400 font-semibold mb-2">로그인 완료</p>
                    <p className="text-white text-sm">{user?.email}</p>
                  </div>
                  
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaWallet className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">지갑 연결</h3>
                  <p className="text-blue-200 mb-6 text-center">다양한 지갑을 지원합니다</p>
                  
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

        {/* Step 3: Investment Selection & Form (로그인 + 지갑 연결 후에만 표시) */}
        {isLoggedIn && isWalletConnected && (
          <>
            {/* 투자 타입 선택 */}
            <section className="py-16">
              <div className="container mx-auto px-5 sm:px-10">
                <div className="max-w-4xl mx-auto mb-8">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">투자 타입 선택</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setInvestmentType('global')}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                          investmentType === 'global'
                            ? 'border-blue-400 bg-blue-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <FaHandHoldingHeart className={`text-4xl mx-auto mb-4 ${investmentType === 'global' ? 'text-blue-400' : 'text-blue-200'}`} />
                        <h4 className="text-xl font-bold text-white mb-2">글로벌부산 기부</h4>
                        <p className="text-blue-200 text-sm">Global BUSAN 프로젝트 전체를 지원하는 기부</p>
                      </button>
                      
                      <button
                        onClick={() => setInvestmentType('project')}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                          investmentType === 'project'
                            ? 'border-purple-400 bg-purple-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <FaBuilding className={`text-4xl mx-auto mb-4 ${investmentType === 'project' ? 'text-purple-400' : 'text-blue-200'}`} />
                        <h4 className="text-xl font-bold text-white mb-2">프로젝트 투자</h4>
                        <p className="text-blue-200 text-sm">특정 프로젝트에 직접 투자</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 투자 폼 */}
            <section className="py-16">
              <div className="container mx-auto px-5 sm:px-10">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <h3 className="text-3xl font-bold text-white text-center mb-8">
                      {investmentType === 'global' ? '글로벌부산 기부하기' : '프로젝트 투자하기'}
                    </h3>
                    
                    {/* 프로젝트 선택 (프로젝트 투자 타입일 경우) */}
                    {investmentType === 'project' && (
                      <div className="mb-6">
                        <label className="block text-white font-semibold mb-3">투자할 프로젝트 선택</label>
                        <select
                          value={selectedProject?.id || ''}
                          onChange={(e) => {
                            const project = projects.find(p => p.id === parseInt(e.target.value))
                            setSelectedProject(project || null)
                          }}
                          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
                        >
                          <option value="">프로젝트를 선택하세요</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.id} className="bg-gray-900">
                              {project.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Crypto Selection */}
                    <div className="mb-6">
                      <label className="block text-white font-semibold mb-3">암호화폐 선택</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { symbol: 'ETH', name: 'Ethereum', icon: FaEthereum, color: 'bg-blue-500' },
                          { symbol: 'BTC', name: 'Bitcoin', icon: FaBitcoin, color: 'bg-orange-500' },
                          { symbol: 'SOL', name: 'Solana', icon: SiSolana, color: 'bg-purple-500' }
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

                    {/* Donation Address Display */}
                    <div className="mb-6">
                      <label className="block text-white font-semibold mb-3">투자 주소</label>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-white font-mono text-sm break-all">
                              {getCurrentAddress() || '주소를 선택해주세요'}
                            </p>
                          </div>
                          {getCurrentAddress() && (
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => copyAddress(selectedCrypto)}
                                className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-300"
                                title="주소 복사"
                              >
                                <FaCopy className="text-white text-sm" />
                              </button>
                              <button
                                onClick={() => setShowQRCode(!showQRCode)}
                                className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-300"
                                title="QR 코드 보기"
                              >
                                <FaQrcode className="text-white text-sm" />
                              </button>
                            </div>
                          )}
                        </div>
                        {copiedAddress === selectedCrypto && (
                          <p className="text-green-400 text-sm mt-2">주소가 복사되었습니다!</p>
                        )}
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

                    {/* Invest Button */}
                    <button
                      onClick={handleInvestment}
                      disabled={!donationAmount || isDonating || (investmentType === 'project' && !selectedProject) || !getCurrentAddress()}
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
                          {investmentType === 'global' ? '기부하기' : '투자하기'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* QR Code Modal */}
        {showQRCode && getCurrentAddress() && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm mx-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">QR 코드</h3>
                <div className="bg-gray-100 rounded-xl p-8 mb-4">
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                    <div className="text-gray-500 text-sm text-center">
                      QR 코드 생성 중...<br />
                      (실제 구현에서는 QR 라이브러리 사용)
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {selectedCrypto} 주소를 스캔하세요
                </p>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Investment History & Analytics */}
        {donationHistory.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-5 sm:px-10">
              <div className="max-w-6xl mx-auto">
                <h3 className="text-4xl font-bold text-white text-center mb-12">투자 기록 및 분석</h3>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                    <FaChartLine className="text-4xl text-green-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{totalInvested.toFixed(4)}</div>
                    <div className="text-blue-200">총 투자 금액</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                    <FaHistory className="text-4xl text-blue-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{investmentCount}</div>
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
                              {transaction.amount} {transaction.crypto} - {transaction.type === 'global' ? '글로벌부산 기부' : `프로젝트 투자: ${transaction.project?.title || 'N/A'}`}
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
