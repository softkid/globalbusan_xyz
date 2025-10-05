import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaChartLine, FaUsers, FaDollarSign } from 'react-icons/fa'
import { SiSolana, SiEthereum, SiBitcoin } from 'react-icons/si'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { projectService } from '../lib/supabase'

function Admin() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
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
    { id: 'defi', name: 'DeFi' },
    { id: 'nft', name: 'NFT' },
    { id: 'gaming', name: '게임' }
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

  // 프로젝트 로드
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await projectService.getProjects()
      setProjects(data || [])
    } catch (error) {
      console.error('프로젝트 로드 실패:', error)
      setProjects([])
      alert('프로젝트를 불러오는데 실패했습니다. Supabase 연결을 확인해주세요.')
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
      <Navbar />
      
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

        {/* 통계 */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaChartLine className="text-4xl text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{projects.length}</div>
                <div className="text-blue-200">총 프로젝트</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaDollarSign className="text-4xl text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">
                  ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                </div>
                <div className="text-blue-200">총 예산</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaUsers className="text-4xl text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">
                  {projects.reduce((sum, p) => sum + p.team_size, 0)}
                </div>
                <div className="text-blue-200">총 팀원</div>
              </div>
            </div>
          </div>
        </section>

        {/* 프로젝트 목록 */}
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

        {/* 프로젝트 폼 모달 */}
        {showForm && (
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
