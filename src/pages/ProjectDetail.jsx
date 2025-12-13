import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaRocket, FaDollarSign, FaUsers, FaCalendarAlt, FaChartLine, FaBuilding, FaArrowLeft, FaHandHoldingHeart } from 'react-icons/fa'
import { SiSolana, SiEthereum, SiBitcoin } from 'react-icons/si'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { t } from '../lib/i18n'
import { projectService } from '../lib/supabase'
import { useTranslation } from 'react-i18next'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t: translate } = useTranslation()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Structured Data for Project Detail Page
  const structuredData = project ? {
    "@context": "https://schema.org",
    "@type": "Project",
    "name": project.title,
    "description": project.description,
    "url": `https://globalbusan.xyz/projects/${id}`,
    "funder": {
      "@type": "Organization",
      "name": "Global BUSAN",
      "url": "https://globalbusan.xyz"
    },
    "category": project.category,
    "status": project.status,
    "budget": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": project.budget
    },
    "amountRaised": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": project.raised || 0
    },
    "startDate": project.created_at,
    "expectedReturn": project.expected_return ? `${project.expected_return}%` : undefined
  } : null

  useEffect(() => {
    loadProject()
  }, [id])

  const loadProject = async () => {
    try {
      setLoading(true)
      const projects = await projectService.getProjects()
      const foundProject = projects?.find(p => p.id === parseInt(id))
      setProject(foundProject || null)
    } catch (error) {
      console.error('프로젝트 로드 실패:', error)
      setProject(null)
    } finally {
      setLoading(false)
    }
  }

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

  const getCryptoIcon = (crypto) => {
    switch (crypto) {
      case 'SOL': return SiSolana
      case 'ETH': return SiEthereum
      case 'BTC': return SiBitcoin
      default: return FaDollarSign
    }
  }

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

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-5 sm:px-10 py-20 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">프로젝트를 찾을 수 없습니다</h1>
            <button
              onClick={() => navigate('/projects')}
              className="mt-8 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
            >
              <FaArrowLeft />
              프로젝트 목록으로 돌아가기
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const CryptoIcon = getCryptoIcon(project.crypto_type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <SEO
        title={`${project.title} - Global BUSAN`}
        description={project.description || `프로젝트 상세 정보: ${project.title}`}
        keywords={`${project.category}, 프로젝트, 투자, 부산, ${project.title}`}
        url={`https://globalbusan.xyz/projects/${id}`}
        structuredData={structuredData}
      />
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-5 sm:px-10 py-10">
          <button
            onClick={() => navigate('/projects')}
            className="mb-8 inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors duration-300"
          >
            <FaArrowLeft />
            프로젝트 목록으로 돌아가기
          </button>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            {/* 프로젝트 헤더 */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
                <p className="text-xl text-blue-200 mb-6">{project.description}</p>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <span className={`px-4 py-2 rounded-full text-white ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                  <span className="text-blue-200 flex items-center gap-2">
                    <FaCalendarAlt />
                    {project.timeline}
                  </span>
                  <span className="text-blue-200 flex items-center gap-2">
                    <FaUsers />
                    {project.team_size}명
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <CryptoIcon className="text-4xl text-blue-400" />
                <span className="text-white font-semibold text-lg">{project.crypto_type}</span>
              </div>
            </div>

            {/* 진행률 바 */}
            <div className="mb-8">
              <div className="flex justify-between text-lg text-blue-200 mb-3">
                <span>진행률</span>
                <span className="font-bold">{project.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* 예산 정보 */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-6">
                <div className="text-blue-200 text-sm mb-2">예산</div>
                <div className="text-white font-bold text-2xl">${project.budget.toLocaleString()}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <div className="text-blue-200 text-sm mb-2">모금액</div>
                <div className="text-white font-bold text-2xl">${project.raised.toLocaleString()}</div>
              </div>
            </div>

            {/* 예상 수익률 */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-green-200 text-lg">예상 수익률</span>
                <span className="text-green-400 font-bold text-3xl">{project.expected_return}%</span>
              </div>
            </div>

            {/* 기술 스택 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">기술 스택</h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  // 로그인 체크
                  const savedUser = localStorage.getItem('googleUser')
                  if (!savedUser) {
                    alert('로그인이 필요합니다.')
                    navigate('/invest')
                    return
                  }
                  
                  // 지갑 연결 체크 및 투자 페이지로 이동
                  navigate(`/invest?projectId=${project.id}`)
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaHandHoldingHeart />
                투자하기
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProjectDetail

