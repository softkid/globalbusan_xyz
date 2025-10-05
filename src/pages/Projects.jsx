import { useState, useEffect } from 'react'
import { FaRocket, FaDollarSign, FaUsers, FaCalendarAlt, FaChartLine, FaBuilding, FaCode, FaGlobe } from 'react-icons/fa'
import { SiSolana, SiEthereum, SiBitcoin } from 'react-icons/si'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { projectService, statsService } from '../lib/supabase'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [stats, setStats] = useState({
    totalBudget: 0,
    totalRaised: 0,
    averageReturn: 0,
    totalProjects: 0
  })

  // 카테고리별 필터링
  const categories = [
    { id: 'all', name: '전체', icon: FaRocket },
    { id: 'infrastructure', name: '인프라', icon: FaBuilding },
    { id: 'defi', name: 'DeFi', icon: FaChartLine },
    { id: 'nft', name: 'NFT', icon: FaCode },
    { id: 'gaming', name: '게임', icon: FaGlobe }
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
    switch (status) {
      case 'planning': return '기획 중'
      case 'development': return '개발 중'
      case 'testing': return '테스트 중'
      case 'launched': return '출시됨'
      case 'completed': return '완료됨'
      default: return '알 수 없음'
    }
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

  // 프로젝트 데이터 로드
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const [projectsData, statsData] = await Promise.all([
        projectService.getProjects(),
        statsService.getProjectStats()
      ])
      
      setProjects(projectsData || [])
      setStats({
        totalBudget: statsData?.total_budget || 0,
        totalRaised: statsData?.total_raised || 0,
        averageReturn: statsData?.avg_expected_return || 0,
        totalProjects: statsData?.total_projects || 0
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
          <div className="text-white text-xl">프로젝트를 불러오는 중...</div>
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
              개발 <span className="text-blue-300">프로젝트</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed mb-12">
              기부금으로 개발되는 혁신적인 프로젝트들을 확인하고 투자 성과를 추적해보세요
            </p>
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
                <h3 className="text-3xl font-bold text-white mb-4">프로젝트가 없습니다</h3>
                <p className="text-blue-200 text-lg mb-8">
                  {selectedCategory === 'all' 
                    ? '아직 등록된 프로젝트가 없습니다.' 
                    : '이 카테고리에 해당하는 프로젝트가 없습니다.'}
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300"
                >
                  전체 프로젝트 보기
                </button>
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
                      <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300">
                        자세히 보기
                      </button>
                      <button className="px-6 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all duration-300">
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
