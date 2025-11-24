import { useState, useEffect } from 'react'
import { FaRocket, FaDollarSign, FaUsers, FaCalendarAlt, FaChartLine, FaBuilding, FaCode, FaGlobe, FaFileAlt, FaGoogle, FaWallet } from 'react-icons/fa'
import { SiSolana, SiEthereum, SiBitcoin } from 'react-icons/si'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { t } from '../lib/i18n'
import { projectService, statsService } from '../lib/supabase'

function Projects() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [stats, setStats] = useState({
    totalBudget: 0,
    totalRaised: 0,
    averageReturn: 0,
    totalProjects: 0
  })

  // 카테고리별 필터링 (i18n 적용)
  const categories = [
    { id: 'all', name: t('projects.allCategories'), icon: FaRocket },
    { id: 'infrastructure', name: '인프라', icon: FaBuilding },
    { id: 'it', name: 'IT/소프트웨어', icon: FaCode },
    { id: 'manufacturing', name: '제조업', icon: FaBuilding },
    { id: 'service', name: '서비스업', icon: FaGlobe },
    { id: 'bio', name: '바이오/의료', icon: FaBuilding },
    { id: 'finance', name: '금융', icon: FaChartLine },
    { id: 'real_estate', name: '부동산', icon: FaBuilding },
    { id: 'tourism', name: '관광/호텔', icon: FaGlobe },
    { id: 'logistics', name: '물류/운송', icon: FaGlobe },
    { id: 'energy', name: '에너지', icon: FaBuilding },
    { id: 'healthcare', name: '의료/건강', icon: FaBuilding },
    { id: 'education', name: '교육', icon: FaGlobe },
    { id: 'agriculture', name: '농업', icon: FaBuilding },
    { id: 'retail', name: '유통/소매', icon: FaGlobe },
    { id: 'construction', name: '건설', icon: FaBuilding },
    { id: 'media', name: '미디어/엔터', icon: FaGlobe },
    { id: 'defi', name: 'DeFi', icon: FaChartLine },
    { id: 'nft', name: 'NFT', icon: FaCode },
    { id: 'gaming', name: '게임', icon: FaGlobe },
    { id: 'other', name: '기타', icon: FaGlobe }
  ]

  // 프로젝트 상태별 색상
  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-yellow-500'
      case 'development': return 'bg-blue-500'
      case 'testing': return 'bg-purple-500'
      case 'launched': return 'bg-green-500'
      case 'completed': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    return t(`projects.status.${status}`) || status
  }

  // 암호화폐 아이콘
  const getCryptoIcon = (crypto) => {
    switch (crypto) {
      case 'SOL': return SiSolana
      case 'ETH': return SiEthereum
      case 'BTC': return SiBitcoin
      default: return FaDollarSign
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
        loadProjects(userData.email)
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        alert('사용자 정보를 가져오는데 실패했습니다.')
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error)
      alert('Google 로그인에 실패했습니다.')
    }
  })

  // 프로젝트 데이터 로드 (모든 프로젝트 표시)
  useEffect(() => {
    loadProjects()
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

  const loadProjects = async () => {
    try {
      setLoading(true)
      const projectsData = await projectService.getProjects()
      
      // 모든 프로젝트 표시
      const allProjects = projectsData || []
      setProjects(allProjects)
      
      // 통계는 모든 프로젝트 기준으로 계산
      const totalBudget = allProjects.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0)
      const totalRaised = allProjects.reduce((sum, p) => sum + parseFloat(p.raised || 0), 0)
      const avgReturn = allProjects.length > 0 
        ? allProjects.reduce((sum, p) => sum + parseFloat(p.expected_return || 0), 0) / allProjects.length 
        : 0
      
      setStats({
        totalBudget,
        totalRaised,
        averageReturn: avgReturn,
        totalProjects: allProjects.length
      })
    } catch (error) {
      console.error('데이터 로드 실패:', error)
      setProjects([])
      setStats({
        totalBudget: 0,
        totalRaised: 0,
        averageReturn: 0,
        totalProjects: 0
      })
    } finally {
      setLoading(false)
    }
  }

  // 투자하기 버튼 클릭 핸들러
  const handleInvestClick = async (projectId) => {
    // 로그인 체크
    if (!isLoggedIn) {
      // 바로 구글 로그인 실행
      handleGoogleLogin()
      return
    }

    // 지갑 연결 체크
    let walletAddress = ''
    let isWalletConnected = false

    try {
      // MetaMask 우선 시도
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        walletAddress = accounts[0]
        isWalletConnected = true
      } else if (window.solana && window.solana.isPhantom) {
        // Solana 지갑 시도
        const response = await window.solana.connect()
        walletAddress = response.publicKey.toString()
        isWalletConnected = true
      }
    } catch (error) {
      console.error('지갑 연결 실패:', error)
      alert('지갑 연결이 필요합니다. 지갑을 연결한 후 다시 시도해주세요.')
      return
    }

    if (!isWalletConnected || !walletAddress) {
      alert('지갑 연결이 필요합니다. 지갑을 연결한 후 다시 시도해주세요.')
      return
    }

    // 투자 페이지로 이동 (프로젝트 ID 포함)
    navigate(`/invest?projectId=${projectId}`)
  }

  // 필터링된 프로젝트
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  // 통계 계산 (이제 서버에서 가져온 데이터 사용)
  const totalBudget = stats.totalBudget
  const totalRaised = stats.totalRaised
  const averageReturn = stats.averageReturn

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">{t('common.loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-5 sm:px-10">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8">
              {t('projects.title')} <span className="text-blue-300">{t('projects.subtitle')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed mb-8">
              {t('projects.description')}
            </p>
            
            {isLoggedIn && (
              <button
                onClick={() => navigate('/apply')}
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300"
              >
                <FaFileAlt />
                {t('projects.applyProject')}
              </button>
            )}
          </div>
        </section>

        {/* 통계 섹션 */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaDollarSign className="text-4xl text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">${totalBudget.toLocaleString()}</div>
                <div className="text-blue-200">총 예산</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaChartLine className="text-4xl text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">${totalRaised.toLocaleString()}</div>
                <div className="text-blue-200">모금된 금액</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaRocket className="text-4xl text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{averageReturn.toFixed(1)}%</div>
                <div className="text-blue-200">평균 예상 수익률</div>
              </div>
            </div>
          </div>
        </section>

        {/* 카테고리 필터 */}
        <section className="py-8">
          <div className="container mx-auto px-5 sm:px-10">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-blue-200 hover:bg-white/20'
                    }`}
                  >
                    <Icon className="text-lg" />
                    {category.name}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* 프로젝트 목록 */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">📊</div>
                <h3 className="text-3xl font-bold text-white mb-4">{t('projects.noProjects')}</h3>
                <p className="text-blue-200 text-lg mb-8">
                  {isLoggedIn 
                    ? t('projects.noProjects') 
                    : '로그인하여 신청한 프로젝트를 확인하세요.'}
                </p>
                <div className="flex gap-4 justify-center">
                  {isLoggedIn ? (
                    <button
                      onClick={() => navigate('/apply')}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300 flex items-center gap-2"
                    >
                      <FaFileAlt />
                      {t('projects.applyProject')}
                    </button>
                  ) : (
                    <button
                      onClick={handleGoogleLogin}
                      className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300 flex items-center gap-2"
                    >
                      <FaGoogle />
                      Google로 로그인
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredProjects.map((project) => {
                const CryptoIcon = getCryptoIcon(project.crypto_type)
                const progressPercentage = (project.raised / project.budget) * 100
                
                return (
                  <div key={project.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    {/* 프로젝트 헤더 */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                        <p className="text-blue-200 mb-4">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-white ${getStatusColor(project.status)}`}>
                            {getStatusText(project.status)}
                          </span>
                          <span className="text-blue-200 flex items-center gap-1">
                            <FaCalendarAlt className="text-xs" />
                            {project.timeline}
                          </span>
                          <span className="text-blue-200 flex items-center gap-1">
                            <FaUsers className="text-xs" />
                            {project.team_size}명
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <CryptoIcon className="text-2xl text-blue-400" />
                        <span className="text-white font-semibold">{project.crypto_type}</span>
                      </div>
                    </div>

                    {/* 진행률 바 */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-blue-200 mb-2">
                        <span>진행률</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* 예산 정보 */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-blue-200 text-sm mb-1">예산</div>
                        <div className="text-white font-bold text-lg">${project.budget.toLocaleString()}</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-blue-200 text-sm mb-1">모금액</div>
                        <div className="text-white font-bold text-lg">${project.raised.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* 예상 수익률 */}
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-green-200 text-sm">예상 수익률</span>
                        <span className="text-green-400 font-bold text-xl">{project.expected_return}%</span>
                      </div>
                    </div>

                    {/* 기술 스택 */}
                    <div className="mb-6">
                      <div className="text-blue-200 text-sm mb-2">기술 스택</div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        자세히 보기
                      </button>
                      <button 
                        onClick={() => handleInvestClick(project.id)}
                        className="px-6 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        투자하기
                      </button>
                    </div>
                  </div>
                )
              })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Projects
