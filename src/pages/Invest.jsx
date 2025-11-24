import { useState, useEffect } from 'react'
import { FaGoogle, FaCheckCircle, FaBuilding, FaRocket, FaChartLine, FaHistory, FaHandHoldingHeart, FaArrowRight, FaEye } from 'react-icons/fa'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { t } from '../lib/i18n'
import { projectService, investmentService } from '../lib/supabase'

function Invest() {
  const navigate = useNavigate()
  // 인증 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  
  // 프로젝트 데이터
  const [newProjects, setNewProjects] = useState([])
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [loading, setLoading] = useState(true)
  
  // 투자/기부 내역
  const [investments, setInvestments] = useState([])
  const [donations, setDonations] = useState([])
  const [participations, setParticipations] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    loadProjects()
    const savedUser = localStorage.getItem('googleUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsLoggedIn(true)
        loadUserHistory(userData.email)
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
      
      // 신규 프로젝트 (최근 생성된 순으로 정렬, 최대 3개)
      const sortedByDate = [...(projectsData || [])].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      )
      setNewProjects(sortedByDate.slice(0, 3))
      
      // 유망 프로젝트 (예상 수익률 높은 순으로 정렬, 최대 3개)
      const sortedByReturn = [...(projectsData || [])].sort((a, b) => 
        (b.expected_return || 0) - (a.expected_return || 0)
      )
      setFeaturedProjects(sortedByReturn.slice(0, 3))
    } catch (error) {
      console.error('프로젝트 로드 실패:', error)
      setNewProjects([])
      setFeaturedProjects([])
    } finally {
      setLoading(false)
    }
  }

  const loadUserHistory = async (userEmail) => {
    if (!userEmail) return
    
    try {
      setLoadingHistory(true)
      // 실제로는 사용자 이메일로 투자/기부 내역 조회
      const investmentsData = await investmentService.getInvestments()
      // 사용자의 투자 내역 필터링 (실제로는 API에서 필터링)
      setInvestments(investmentsData || [])
      
      // 기부 내역은 별도로 관리 (실제로는 기부 테이블에서 조회)
      setDonations([])
      
      // 프로젝트 참여 내역 (실제로는 신청한 프로젝트 조회)
      setParticipations([])
    } catch (error) {
      console.error('내역 로드 실패:', error)
    } finally {
      setLoadingHistory(false)
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
        loadUserHistory(userData.email)
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

  // 통계 계산
  const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0)
  const totalDonated = donations.reduce((sum, don) => sum + parseFloat(don.amount || 0), 0)
  const investmentCount = investments.length
  const donationCount = donations.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-5 sm:px-10">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8">
              내 정보 <span className="text-blue-300">My Information</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed mb-12">
              투자 및 기부 내역을 확인하고 프로젝트를 탐색하세요
            </p>
          </div>
        </section>

        {/* Login Section */}
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
                    <p className="text-blue-200 mb-6">투자 및 기부 내역을 확인하려면 로그인이 필요합니다</p>
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

        {isLoggedIn && (
          <>
            {/* User Stats */}
            <section className="py-16">
              <div className="container mx-auto px-5 sm:px-10">
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                      <FaBuilding className="text-3xl text-green-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white mb-2">${totalInvested.toLocaleString()}</div>
                      <div className="text-blue-200 text-sm">{t('invest.totalInvested')}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                      <FaHandHoldingHeart className="text-3xl text-pink-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white mb-2">${totalDonated.toLocaleString()}</div>
                      <div className="text-blue-200 text-sm">{t('invest.totalDonated')}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                      <FaChartLine className="text-3xl text-blue-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white mb-2">{investmentCount}</div>
                      <div className="text-blue-200 text-sm">{t('invest.investmentCount')}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                      <FaHistory className="text-3xl text-purple-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white mb-2">{donationCount}</div>
                      <div className="text-blue-200 text-sm">{t('invest.donationCount')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* New Projects */}
            <section className="py-16">
              <div className="container mx-auto px-5 sm:px-10">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-4xl font-bold text-white">{t('invest.newProjects')}</h2>
                    <Link 
                      to="/projects"
                      className="text-blue-300 hover:text-blue-200 flex items-center gap-2 transition-colors duration-300"
                    >
                      {t('common.viewAll')} <FaArrowRight />
                    </Link>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-blue-200">{t('common.loading')}</p>
                    </div>
                  ) : newProjects.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                      <p className="text-blue-200 text-lg">{t('common.noData')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {newProjects.map((project) => (
                        <div key={project.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-4">
                            <FaRocket className="text-blue-400 text-xl" />
                            <h3 className="text-xl font-bold text-white">{project.title}</h3>
                          </div>
                          <p className="text-blue-200 text-sm mb-4 line-clamp-2">{project.description}</p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-green-400 font-semibold">{project.expected_return}% {t('projects.status.development')}</span>
                            <span className="text-blue-200 text-sm">${project.budget.toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <FaEye />
                            상세보기
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Featured Projects */}
            <section className="py-16">
              <div className="container mx-auto px-5 sm:px-10">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-4xl font-bold text-white">{t('invest.featuredProjects')}</h2>
                    <Link 
                      to="/projects"
                      className="text-blue-300 hover:text-blue-200 flex items-center gap-2 transition-colors duration-300"
                    >
                      {t('common.viewAll')} <FaArrowRight />
                    </Link>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-blue-200">{t('common.loading')}</p>
                    </div>
                  ) : featuredProjects.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                      <p className="text-blue-200 text-lg">{t('common.noData')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {featuredProjects.map((project) => (
                        <div key={project.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-4">
                            <FaRocket className="text-purple-400 text-xl" />
                            <h3 className="text-xl font-bold text-white">{project.title}</h3>
                          </div>
                          <p className="text-blue-200 text-sm mb-4 line-clamp-2">{project.description}</p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-green-400 font-semibold">{project.expected_return}% {t('projects.status.development')}</span>
                            <span className="text-blue-200 text-sm">${project.budget.toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <FaEye />
                            상세보기
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Investment & Donation History */}
            <section className="py-16">
              <div className="container mx-auto px-5 sm:px-10">
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Investment History */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                      <div className="flex items-center gap-3 mb-6">
                        <FaBuilding className="text-3xl text-blue-400" />
                        <h3 className="text-2xl font-bold text-white">{t('invest.myInvestments')}</h3>
                      </div>
                      
                      {loadingHistory ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                          <p className="text-blue-200 text-sm">{t('common.loading')}</p>
                        </div>
                      ) : investments.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-blue-200 mb-4">{t('common.noData')}</p>
                          <button
                            onClick={() => navigate('/projects')}
                            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors duration-300"
                          >
                            지금 투자하기 <FaArrowRight />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {investments.slice(0, 5).map((investment) => (
                            <div key={investment.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-white font-semibold">
                                    ${investment.amount.toLocaleString()} {investment.crypto_type}
                                  </div>
                                  <div className="text-blue-200 text-sm">
                                    {investment.project_id ? `Project #${investment.project_id}` : 'General'}
                                  </div>
                                  <div className="text-blue-200 text-xs">
                                    {new Date(investment.investment_date).toLocaleDateString('ko-KR')}
                                  </div>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                                  investment.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {investment.status === 'confirmed' ? '완료' : '대기중'}
                                </span>
                              </div>
                            </div>
                          ))}
                          <div className="mt-4">
                            <button
                              onClick={() => navigate('/projects')}
                              className="w-full inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
                            >
                              지금 투자하기 <FaArrowRight />
                            </button>
                          </div>
                          {investments.length > 5 && (
                            <Link
                              to="/projects"
                              className="block text-center text-blue-300 hover:text-blue-200 transition-colors duration-300 mt-4"
                            >
                              {t('common.viewAll')}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Donation History */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                      <div className="flex items-center gap-3 mb-6">
                        <FaHandHoldingHeart className="text-3xl text-pink-400" />
                        <h3 className="text-2xl font-bold text-white">{t('invest.myDonations')}</h3>
                      </div>
                      
                      {loadingHistory ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                          <p className="text-blue-200 text-sm">{t('common.loading')}</p>
                        </div>
                      ) : donations.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-blue-200 mb-4">{t('common.noData')}</p>
                          <Link
                            to="/donation"
                            className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors duration-300"
                          >
                            {t('donation.donateNow')} <FaArrowRight />
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {donations.slice(0, 5).map((donation) => (
                            <div key={donation.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-white font-semibold">
                                    ${donation.amount.toLocaleString()} {donation.crypto_type}
                                  </div>
                                  <div className="text-blue-200 text-xs">
                                    {new Date(donation.date).toLocaleDateString('ko-KR')}
                                  </div>
                                </div>
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">
                                  완료
                                </span>
                              </div>
                            </div>
                          ))}
                          {donations.length > 5 && (
                            <Link
                              to="/donation"
                              className="block text-center text-blue-300 hover:text-blue-200 transition-colors duration-300 mt-4"
                            >
                              {t('common.viewAll')}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Participation */}
                  {participations.length > 0 && (
                    <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                      <div className="flex items-center gap-3 mb-6">
                        <FaRocket className="text-3xl text-green-400" />
                        <h3 className="text-2xl font-bold text-white">{t('invest.projectParticipation')}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {participations.map((project) => (
                          <div key={project.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <h4 className="text-white font-semibold mb-2">{project.title}</h4>
                            <p className="text-blue-200 text-sm mb-3 line-clamp-2">{project.description}</p>
                            <div className="flex items-center justify-between">
                              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                project.status === 'development' ? 'bg-blue-500/20 text-blue-400' :
                                project.status === 'launched' ? 'bg-green-500/20 text-green-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {t(`projects.status.${project.status}`)}
                              </span>
                              <span className="text-blue-200 text-sm">{project.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Invest
