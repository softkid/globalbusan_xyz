import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaChartLine, FaUsers, FaDollarSign, FaHandHoldingHeart, FaBuilding } from 'react-icons/fa'
import { SiSolana, SiEthereum, SiBitcoin } from 'react-icons/si'
import AdminNavbar from '../components/AdminNavbar'
import Footer from '../components/Footer'
import { t } from '../lib/i18n'
import { projectService, statsService, investorService, investmentService, expenseService } from '../lib/supabase'

function Admin() {
  const [activeTab, setActiveTab] = useState('projects') // 'projects' or 'donations'
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  
  // 기부 관리 상태
  const [donations, setDonations] = useState([])
  const [donationStats, setDonationStats] = useState({
    totalDonations: 0,
    donationCount: 0,
    donorCount: 0
  })
  const [donorDetails, setDonorDetails] = useState([])
  const [donationUsage, setDonationUsage] = useState([])
  const [showUsageForm, setShowUsageForm] = useState(false)
  const [editingUsage, setEditingUsage] = useState(null)
  const [usageFormData, setUsageFormData] = useState({
    category: 'development',
    description: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    project_id: null
  })
  
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBudget: 0,
    totalTeamMembers: 0,
    totalInvestors: 0,
    totalInvestments: 0,
    totalExpenses: 0
  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'infrastructure',
    status: 'planning',
    budget: '',
    raised: '',
    expected_return: '',
    timeline: '',
    crypto_type: 'ETH',
    progress: 0,
    team_size: '',
    technologies: []
  })

  const categories = [
    { id: 'infrastructure', name: '인프라' },
    { id: 'it', name: 'IT/소프트웨어' },
    { id: 'manufacturing', name: '제조업' },
    { id: 'service', name: '서비스업' },
    { id: 'bio', name: '바이오/의료' },
    { id: 'finance', name: '금융' },
    { id: 'real_estate', name: '부동산' },
    { id: 'tourism', name: '관광/호텔' },
    { id: 'logistics', name: '물류/운송' },
    { id: 'energy', name: '에너지' },
    { id: 'healthcare', name: '의료/건강' },
    { id: 'education', name: '교육' },
    { id: 'agriculture', name: '농업' },
    { id: 'retail', name: '유통/소매' },
    { id: 'construction', name: '건설' },
    { id: 'media', name: '미디어/엔터테인먼트' },
    { id: 'defi', name: 'DeFi' },
    { id: 'nft', name: 'NFT' },
    { id: 'gaming', name: '게임' },
    { id: 'other', name: '기타' }
  ]

  const statuses = [
    { id: 'planning', name: '기획 중' },
    { id: 'development', name: '개발 중' },
    { id: 'testing', name: '테스트 중' },
    { id: 'launched', name: '출시됨' },
    { id: 'completed', name: '완료됨' }
  ]

  const cryptoTypes = [
    { id: 'ETH', name: 'Ethereum', icon: SiEthereum },
    { id: 'SOL', name: 'Solana', icon: SiSolana },
    { id: 'BTC', name: 'Bitcoin', icon: SiBitcoin }
  ]

  const techOptions = [
    'React', 'Next.js', 'Node.js', 'Solidity', 'Web3.js', 'Ethereum', 'Solana', 'IPFS', 
    'Unity', 'Unreal Engine', 'Hardhat', 'Truffle', 'Metaplex', 'OpenZeppelin'
  ]

  // 데이터 로드
  useEffect(() => {
    loadProjects()
    if (activeTab === 'donations') {
      loadDonations()
    }
  }, [activeTab])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const [projectsData, projectStats, investorStats, investmentStats] = await Promise.all([
        projectService.getProjects(),
        statsService.getProjectStats(),
        statsService.getInvestorStats(),
        statsService.getInvestmentStats()
      ])
      
      setProjects(projectsData || [])
      setStats({
        totalProjects: projectStats?.total_projects || 0,
        totalBudget: projectStats?.total_budget || 0,
        totalTeamMembers: projectStats?.total_team_members || 0,
        totalInvestors: investorStats?.total_investors || 0,
        totalInvestments: investmentStats?.total_investments || 0,
        totalExpenses: 0 // 지출 통계는 별도로 계산
      })
    } catch (error) {
      console.error('데이터 로드 실패:', error)
      setProjects([])
      setStats({
        totalProjects: 0,
        totalBudget: 0,
        totalTeamMembers: 0,
        totalInvestors: 0,
        totalInvestments: 0,
        totalExpenses: 0
      })
      alert('데이터를 불러오는데 실패했습니다. Supabase 연결을 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'infrastructure',
      status: 'planning',
      budget: '',
      raised: '',
      expected_return: '',
      timeline: '',
      crypto_type: 'ETH',
      progress: 0,
      team_size: '',
      technologies: []
    })
    setEditingProject(null)
    setShowForm(false)
  }

  // 프로젝트 생성/수정
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const projectData = {
        ...formData,
        budget: parseFloat(formData.budget),
        raised: parseFloat(formData.raised),
        expected_return: parseFloat(formData.expected_return),
        progress: parseInt(formData.progress),
        team_size: parseInt(formData.team_size)
      }

      if (editingProject) {
        await projectService.updateProject(editingProject.id, projectData)
      } else {
        await projectService.createProject(projectData)
      }

      await loadProjects()
      resetForm()
    } catch (error) {
      console.error('프로젝트 저장 실패:', error)
      alert('프로젝트 저장에 실패했습니다.')
    }
  }

  // 프로젝트 삭제
  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      try {
        await projectService.deleteProject(id)
        await loadProjects()
      } catch (error) {
        console.error('프로젝트 삭제 실패:', error)
        alert('프로젝트 삭제에 실패했습니다.')
      }
    }
  }

  // 프로젝트 편집
  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      status: project.status,
      budget: project.budget.toString(),
      raised: project.raised.toString(),
      expected_return: project.expected_return.toString(),
      timeline: project.timeline,
      crypto_type: project.crypto_type,
      progress: project.progress,
      team_size: project.team_size.toString(),
      technologies: project.technologies || []
    })
    setEditingProject(project)
    setShowForm(true)
  }

  // 기술 스택 추가/제거
  const toggleTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }))
  }

  // 기부 관리 함수들
  const loadDonations = async () => {
    try {
      const [investmentsData, investorsData, expensesData] = await Promise.all([
        investmentService.getInvestments(),
        investorService.getInvestors(),
        expenseService.getExpenses()
      ])

      // 글로벌 기부는 project_id가 null인 투자로 간주
      const globalDonations = (investmentsData || []).filter(inv => !inv.project_id)
      
      setDonations(globalDonations)
      
      // 기부 통계 계산
      const totalDonations = globalDonations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0)
      const uniqueDonors = new Set(globalDonations.map(d => d.investor_id)).size
      
      setDonationStats({
        totalDonations,
        donationCount: globalDonations.length,
        donorCount: uniqueDonors
      })

      // 기부자별 내역
      const donorMap = new Map()
      globalDonations.forEach(donation => {
        const investor = investorsData?.find(inv => inv.id === donation.investor_id)
        const donorKey = donation.investor_id
        
        if (!donorMap.has(donorKey)) {
          donorMap.set(donorKey, {
            id: investor?.id,
            name: investor?.name || investor?.email || 'Anonymous',
            email: investor?.email || '',
            totalAmount: 0,
            donationCount: 0,
            donations: []
          })
        }
        
        const donor = donorMap.get(donorKey)
        donor.totalAmount += parseFloat(donation.amount || 0)
        donor.donationCount += 1
        donor.donations.push(donation)
      })

      setDonorDetails(Array.from(donorMap.values()).sort((a, b) => b.totalAmount - a.totalAmount))

      // 기부 사용처 (글로벌 기부 사용처는 project_id가 null인 지출)
      const globalUsage = (expensesData || []).filter(exp => !exp.project_id)
      setDonationUsage(globalUsage)
    } catch (error) {
      console.error('기부 데이터 로드 실패:', error)
    }
  }

  const handleUsageSubmit = async (e) => {
    e.preventDefault()
    try {
      const usageData = {
        ...usageFormData,
        amount: parseFloat(usageFormData.amount),
        project_id: null // 글로벌 기부 사용처
      }

      if (editingUsage) {
        // 수정 로직 (실제로는 expenseService.updateExpense 호출)
        alert('기부 사용처 수정 기능은 추후 구현 예정입니다.')
      } else {
        // 생성 로직 (실제로는 expenseService.createExpense 호출)
        alert('기부 사용처 추가 기능은 추후 구현 예정입니다.')
      }

      resetUsageForm()
      loadDonations()
    } catch (error) {
      console.error('기부 사용처 저장 실패:', error)
      alert('저장에 실패했습니다.')
    }
  }

  const resetUsageForm = () => {
    setUsageFormData({
      category: 'development',
      description: '',
      amount: '',
      expense_date: new Date().toISOString().split('T')[0],
      project_id: null
    })
    setEditingUsage(null)
    setShowUsageForm(false)
  }

  const handleDeleteUsage = async (usageId) => {
    if (!window.confirm('기부 사용처를 삭제하시겠습니까?')) return
    
    try {
      // 실제로는 expenseService.deleteExpense 호출
      alert('기부 사용처 삭제 기능은 추후 구현 예정입니다.')
      loadDonations()
    } catch (error) {
      console.error('기부 사용처 삭제 실패:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  const usageCategories = [
    { id: 'development', name: '개발' },
    { id: 'marketing', name: '마케팅' },
    { id: 'infrastructure', name: '인프라' },
    { id: 'legal', name: '법무' },
    { id: 'operations', name: '운영' },
    { id: 'other', name: '기타' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">관리자 데이터를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <AdminNavbar />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-5 sm:px-10">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8">
              관리자 <span className="text-blue-300">대시보드</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed mb-12">
              프로젝트를 관리하고 새로운 프로젝트를 추가하세요
            </p>
          </div>
        </section>

        {/* 탭 네비게이션 */}
        <section className="py-8">
          <div className="container mx-auto px-5 sm:px-10">
            <div className="flex gap-4 border-b border-white/20">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-3 font-semibold transition-colors duration-300 flex items-center gap-2 ${
                  activeTab === 'projects'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-blue-200 hover:text-blue-300'
                }`}
              >
                <FaBuilding />
                프로젝트 관리
              </button>
              <button
                onClick={() => setActiveTab('donations')}
                className={`px-6 py-3 font-semibold transition-colors duration-300 flex items-center gap-2 ${
                  activeTab === 'donations'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-blue-200 hover:text-blue-300'
                }`}
              >
                <FaHandHoldingHeart />
                기부 관리
              </button>
            </div>
          </div>
        </section>

        {/* 통계 */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            {activeTab === 'projects' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaChartLine className="text-4xl text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stats.totalProjects}</div>
                <div className="text-blue-200">총 프로젝트</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaDollarSign className="text-4xl text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">
                  ${stats.totalBudget.toLocaleString()}
                </div>
                <div className="text-blue-200">총 예산</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaUsers className="text-4xl text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.totalTeamMembers}
                </div>
                <div className="text-blue-200">총 팀원</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaUsers className="text-4xl text-orange-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.totalInvestors}
                </div>
                <div className="text-blue-200">총 투자자</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaDollarSign className="text-4xl text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.totalInvestments}
                </div>
                <div className="text-blue-200">총 투자 건수</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaChartLine className="text-4xl text-red-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">
                  ${stats.totalExpenses.toLocaleString()}
                </div>
                <div className="text-blue-200">총 지출</div>
              </div>
            </div>
            ) : (
              // 기부 관리 통계
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                  <FaHandHoldingHeart className="text-4xl text-pink-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">
                    ${donationStats.totalDonations.toLocaleString()}
                  </div>
                  <div className="text-blue-200">총 기부액</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                  <FaDollarSign className="text-4xl text-green-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{donationStats.donationCount}</div>
                  <div className="text-blue-200">기부 건수</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                  <FaUsers className="text-4xl text-blue-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{donationStats.donorCount}</div>
                  <div className="text-blue-200">기부자 수</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 프로젝트 목록 또는 기부 관리 콘텐츠 */}
        {activeTab === 'projects' ? (
          <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">프로젝트 목록</h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors duration-300"
              >
                <FaPlus className="text-lg" />
                새 프로젝트
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">📊</div>
                <h3 className="text-3xl font-bold text-white mb-4">프로젝트가 없습니다</h3>
                <p className="text-blue-200 text-lg mb-8">
                  아직 등록된 프로젝트가 없습니다. 새 프로젝트를 추가해보세요.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300"
                >
                  첫 프로젝트 추가하기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((project) => (
                <div key={project.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-300"
                      >
                        <FaEdit className="text-white text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-300"
                      >
                        <FaTrash className="text-white text-sm" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-blue-200 mb-4">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-200">예산:</span>
                      <span className="text-white ml-2">${project.budget.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">모금액:</span>
                      <span className="text-white ml-2">${project.raised.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">진행률:</span>
                      <span className="text-white ml-2">{project.progress}%</span>
                    </div>
                    <div>
                      <span className="text-blue-200">수익률:</span>
                      <span className="text-white ml-2">{project.expected_return}%</span>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </section>
        ) : (
          // 기부 관리 콘텐츠
          <>
            {/* 기부 목록 */}
            <section className="py-16">
              <div className="container mx-auto px-5 sm:px-10">
                <h2 className="text-3xl font-bold text-white mb-8">기부 목록</h2>
                
                {donations.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                    <p className="text-blue-200 text-lg">기부 내역이 없습니다.</p>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left text-white font-semibold p-4">날짜</th>
                          <th className="text-left text-white font-semibold p-4">기부자</th>
                          <th className="text-left text-white font-semibold p-4">금액</th>
                          <th className="text-left text-white font-semibold p-4">암호화폐</th>
                          <th className="text-left text-white font-semibold p-4">상태</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donations.slice(0, 20).map((donation) => (
                          <tr key={donation.id} className="border-b border-white/10">
                            <td className="text-blue-200 p-4">
                              {new Date(donation.investment_date).toLocaleDateString('ko-KR')}
                            </td>
                            <td className="text-white p-4">Anonymous</td>
                            <td className="text-green-400 font-semibold p-4">
                              ${parseFloat(donation.amount || 0).toLocaleString()}
                            </td>
                            <td className="text-blue-200 p-4">{donation.crypto_type}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                                donation.status === 'confirmed'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {donation.status === 'confirmed' ? '완료' : '대기중'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* 기부자별 내역 */}
            <section className="py-16">
              <div className="container mx-auto px-5 sm:px-10">
                <h2 className="text-3xl font-bold text-white mb-8">기부자별 내역</h2>
                
                {donorDetails.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                    <p className="text-blue-200 text-lg">기부자 정보가 없습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donorDetails.map((donor) => (
                      <div key={donor.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-2">{donor.name}</h3>
                        <p className="text-blue-200 text-sm mb-4">{donor.email || '이메일 없음'}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-200">총 기부액:</span>
                            <span className="text-green-400 font-semibold">
                              ${donor.totalAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-200">기부 횟수:</span>
                            <span className="text-white font-semibold">{donor.donationCount}건</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* 기부 사용처 관리 */}
            <section className="py-16">
              <div className="container mx-auto px-5 sm:px-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white">기부 사용처 관리</h2>
                  <button
                    onClick={() => setShowUsageForm(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors duration-300"
                  >
                    <FaPlus className="text-lg" />
                    사용처 추가
                  </button>
                </div>

                {donationUsage.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                    <p className="text-blue-200 text-lg mb-4">등록된 기부 사용처가 없습니다.</p>
                    <button
                      onClick={() => setShowUsageForm(true)}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
                    >
                      첫 사용처 추가하기
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donationUsage.map((usage) => (
                      <div key={usage.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-semibold">
                            {usageCategories.find(c => c.id === usage.category)?.name || usage.category}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingUsage(usage)
                                setUsageFormData({
                                  category: usage.category,
                                  description: usage.description,
                                  amount: usage.amount,
                                  expense_date: new Date(usage.expense_date).toISOString().split('T')[0],
                                  project_id: null
                                })
                                setShowUsageForm(true)
                              }}
                              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-300"
                            >
                              <FaEdit className="text-white text-sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteUsage(usage.id)}
                              className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-300"
                            >
                              <FaTrash className="text-white text-sm" />
                            </button>
                          </div>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">${parseFloat(usage.amount || 0).toLocaleString()}</h3>
                        <p className="text-blue-200 text-sm mb-3">{usage.description}</p>
                        <p className="text-blue-300 text-xs">
                          {new Date(usage.expense_date).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* 기부 사용처 폼 모달 */}
            {showUsageForm && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {editingUsage ? '기부 사용처 수정' : '기부 사용처 추가'}
                    </h3>
                    <button
                      onClick={resetUsageForm}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                    >
                      <FaTimes className="text-gray-500" />
                    </button>
                  </div>

                  <form onSubmit={handleUsageSubmit} className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">카테고리</label>
                      <select
                        value={usageFormData.category}
                        onChange={(e) => setUsageFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      >
                        {usageCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">설명</label>
                      <textarea
                        value={usageFormData.description}
                        onChange={(e) => setUsageFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">금액 ($)</label>
                        <input
                          type="number"
                          value={usageFormData.amount}
                          onChange={(e) => setUsageFormData(prev => ({ ...prev, amount: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">사용일</label>
                        <input
                          type="date"
                          value={usageFormData.expense_date}
                          onChange={(e) => setUsageFormData(prev => ({ ...prev, expense_date: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
                      >
                        <FaSave className="text-lg" />
                        {editingUsage ? '수정' : '추가'}
                      </button>
                      <button
                        type="button"
                        onClick={resetUsageForm}
                        className="px-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors duration-300"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* 프로젝트 폼 모달 */}
        {activeTab === 'projects' && showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingProject ? '프로젝트 수정' : '새 프로젝트 추가'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">프로젝트 제목</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">카테고리</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">설명</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">상태</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      {statuses.map(status => (
                        <option key={status.id} value={status.id}>{status.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">암호화폐</label>
                    <select
                      value={formData.crypto_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, crypto_type: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      {cryptoTypes.map(crypto => (
                        <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">타임라인</label>
                    <input
                      type="text"
                      value={formData.timeline}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="예: 12개월"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">예산 ($)</label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">모금액 ($)</label>
                    <input
                      type="number"
                      value={formData.raised}
                      onChange={(e) => setFormData(prev => ({ ...prev, raised: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">수익률 (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.expected_return}
                      onChange={(e) => setFormData(prev => ({ ...prev, expected_return: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">진행률 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => setFormData(prev => ({ ...prev, progress: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">팀 크기</label>
                  <input
                    type="number"
                    value={formData.team_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, team_size: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">기술 스택</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {techOptions.map(tech => (
                      <label key={tech} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.technologies.includes(tech)}
                          onChange={() => toggleTechnology(tech)}
                          className="rounded"
                        />
                        <span className="text-gray-700">{tech}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
                  >
                    <FaSave className="text-lg" />
                    {editingProject ? '수정' : '추가'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors duration-300"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Admin
