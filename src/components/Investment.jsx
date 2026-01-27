import React, { useState, useEffect } from 'react'
import { FaWallet, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa'
import { useSuiWallet } from '../hooks/useSuiWallet'
import { useSuiInvestment } from '../hooks/useSuiInvestment'

const Investment = () => {
  const { connected, address, signAndExecute } = useSuiWallet()
  const { prepareInvestment, recordInvestment, getInvestmentHistory } = useSuiInvestment()

  const [formData, setFormData] = useState({
    projectId: '',
    investmentAmount: '',
    investorName: '',
    notes: ''
  })

  const [transactionStatus, setTransactionStatus] = useState(null) // null, 'preparing', 'signing', 'success', 'error'
  const [statusMessage, setStatusMessage] = useState('')
  const [transactionDigest, setTransactionDigest] = useState('')
  const [projects, setProjects] = useState([
    { id: '1', name: 'Global Busan Tech Hub', minInvestment: 100, target: 10000 },
    { id: '2', name: 'Sustainable Port Initiative', minInvestment: 50, target: 5000 },
    { id: '3', name: 'Smart City Infrastructure', minInvestment: 200, target: 20000 }
  ])

  const [investmentHistory, setInvestmentHistory] = useState([])

  useEffect(() => {
    const history = getInvestmentHistory()
    setInvestmentHistory(history)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.projectId) {
      setStatusMessage('프로젝트를 선택해주세요')
      setTransactionStatus('error')
      return false
    }

    const amount = parseFloat(formData.investmentAmount)
    if (!amount || amount <= 0) {
      setStatusMessage('투자 금액을 입력해주세요 (0 초과)')
      setTransactionStatus('error')
      return false
    }

    const selectedProject = projects.find(p => p.id === formData.projectId)
    if (amount < selectedProject.minInvestment) {
      setStatusMessage(`최소 투자 금액: ${selectedProject.minInvestment} SUI`)
      setTransactionStatus('error')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!connected) {
      setStatusMessage('먼저 지갑을 연결해주세요')
      setTransactionStatus('error')
      return
    }

    if (!validateForm()) {
      return
    }

    try {
      setTransactionStatus('preparing')
      setStatusMessage('거래를 준비 중입니다...')

      const selectedProject = projects.find(p => p.id === formData.projectId)
      const tx = await prepareInvestment(
        formData.projectId,
        formData.investmentAmount,
        selectedProject.name
      )

      setTransactionStatus('signing')
      setStatusMessage('지갑에서 서명해주세요...')

      const result = await signAndExecute(tx)

      if (result.success) {
        setTransactionStatus('success')
        setStatusMessage('투자가 성공적으로 완료되었습니다!')
        setTransactionDigest(result.digest)

        // Record to localStorage
        recordInvestment({
          projectId: formData.projectId,
          projectName: selectedProject.name,
          amount: formData.investmentAmount,
          investorName: formData.investorName || 'Anonymous',
          notes: formData.notes,
          digest: result.digest,
          timestamp: new Date().toISOString()
        })

        // Update history
        const updatedHistory = getInvestmentHistory()
        setInvestmentHistory(updatedHistory)

        // Reset form
        setTimeout(() => {
          setFormData({
            projectId: '',
            investmentAmount: '',
            investorName: '',
            notes: ''
          })
          setTransactionStatus(null)
          setStatusMessage('')
          setTransactionDigest('')
        }, 3000)
      } else {
        setTransactionStatus('error')
        setStatusMessage(`거래 실패: ${result.error || '알 수 없는 오류'}`)
      }
    } catch (err) {
      setTransactionStatus('error')
      setStatusMessage(`오류: ${err.message}`)
      console.error('Investment error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">투자하기</h1>
          <p className="text-gray-300 text-lg">Global Busan 프로젝트에 투자하고 수익을 창출하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Investment Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
              {/* Wallet Status */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2">
                  <FaWallet className={connected ? 'text-green-400' : 'text-red-400'} />
                  <span className="text-white">
                    {connected ? (
                      <>
                        지갑 연결됨: <span className="font-mono text-green-400">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                      </>
                    ) : (
                      <span className="text-red-400">지갑을 연결해주세요</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Selection */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    프로젝트 선택 *
                  </label>
                  <select
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={!connected}
                  >
                    <option value="">프로젝트를 선택하세요</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} (최소: {project.minInvestment} SUI)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Investment Amount */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    투자 금액 (SUI) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="investmentAmount"
                      value={formData.investmentAmount}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      placeholder="예: 10.5"
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      disabled={!connected}
                    />
                    <span className="absolute right-4 top-3 text-gray-400">SUI</span>
                  </div>
                  {formData.projectId && formData.investmentAmount && (
                    <div className="mt-2 text-sm text-gray-300">
                      선택된 프로젝트의 최소 투자액: {projects.find(p => p.id === formData.projectId)?.minInvestment} SUI
                    </div>
                  )}
                </div>

                {/* Investor Name (Optional) */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    투자자 이름 (선택사항)
                  </label>
                  <input
                    type="text"
                    name="investorName"
                    value={formData.investorName}
                    onChange={handleInputChange}
                    placeholder="이름을 입력하세요"
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={!connected}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    추가 사항 (선택사항)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="추가 정보나 요청사항을 입력하세요"
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    disabled={!connected}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!connected || transactionStatus === 'preparing' || transactionStatus === 'signing'}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {transactionStatus === 'preparing' || transactionStatus === 'signing' ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      {transactionStatus === 'preparing' ? '준비 중...' : '서명 중...'}
                    </>
                  ) : (
                    '투자하기'
                  )}
                </button>
              </form>

              {/* Status Message */}
              {statusMessage && (
                <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 ${
                  transactionStatus === 'success'
                    ? 'bg-green-900 border-green-700 text-green-100'
                    : transactionStatus === 'error'
                    ? 'bg-red-900 border-red-700 text-red-100'
                    : 'bg-blue-900 border-blue-700 text-blue-100'
                }`}>
                  {transactionStatus === 'success' ? (
                    <FaCheckCircle className="flex-shrink-0 mt-0.5" />
                  ) : transactionStatus === 'error' ? (
                    <FaExclamationCircle className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <FaSpinner className="flex-shrink-0 mt-0.5 animate-spin" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{statusMessage}</p>
                    {transactionDigest && (
                      <p className="text-sm mt-2 font-mono break-all">
                        Digest: {transactionDigest}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Investment History Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 sticky top-6">
              <h3 className="text-xl font-bold text-white mb-4">나의 투자 기록</h3>

              {investmentHistory.length > 0 ? (
                <div className="space-y-3">
                  {investmentHistory.slice().reverse().map((investment, index) => (
                    <div key={index} className="p-3 bg-gray-700 rounded border border-gray-600">
                      <p className="text-sm text-blue-400 font-semibold">{investment.projectName}</p>
                      <p className="text-lg font-bold text-white">{investment.amount} SUI</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(investment.timestamp).toLocaleDateString('ko-KR')}
                      </p>
                      <p className="text-xs text-gray-500 font-mono mt-1 break-all">
                        {investment.digest?.slice(0, 16)}...
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">아직 투자가 없습니다</p>
              )}
            </div>

            {/* Statistics Card */}
            <div className="mt-6 bg-gradient-to-br from-green-900 to-emerald-800 rounded-lg shadow-xl p-6 border border-green-700">
              <h4 className="text-sm font-semibold text-green-200 mb-4">투자 통계</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-white">
                  <span className="text-sm">총 투자액:</span>
                  <span className="font-bold">
                    {investmentHistory.reduce((sum, inv) => sum + parseFloat(inv.amount), 0).toFixed(2)} SUI
                  </span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-sm">투자 건수:</span>
                  <span className="font-bold">{investmentHistory.length}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-sm">평균 투자액:</span>
                  <span className="font-bold">
                    {investmentHistory.length > 0
                      ? (investmentHistory.reduce((sum, inv) => sum + parseFloat(inv.amount), 0) / investmentHistory.length).toFixed(2)
                      : '0'} SUI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Overview */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-6">사용 가능한 프로젝트</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 hover:border-blue-500 transition">
                <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>최소 투자액: <span className="text-blue-400 font-semibold">{project.minInvestment} SUI</span></p>
                  <p>목표액: <span className="text-green-400 font-semibold">{project.target} SUI</span></p>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-right">45% 달성</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Investment
