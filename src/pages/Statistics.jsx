import { useState, useEffect } from 'react'
import { FaChartLine, FaUsers, FaDollarSign, FaBuilding, FaCalendarAlt } from 'react-icons/fa'
import { SiEthereum, SiSolana, SiBitcoin } from 'react-icons/si'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { statsService } from '../lib/supabase'

function Statistics() {
  const [loading, setLoading] = useState(true)
  const [projectStats, setProjectStats] = useState({})
  const [investorStats, setInvestorStats] = useState({})
  const [investmentStats, setInvestmentStats] = useState({})
  const [monthlyInvestmentStats, setMonthlyInvestmentStats] = useState([])
  const [monthlyExpenseStats, setMonthlyExpenseStats] = useState([])

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      const [
        projectData,
        investorData,
        investmentData,
        monthlyInvestmentData,
        monthlyExpenseData
      ] = await Promise.all([
        statsService.getProjectStats(),
        statsService.getInvestorStats(),
        statsService.getInvestmentStats(),
        statsService.getMonthlyInvestmentStats(),
        statsService.getMonthlyExpenseStats()
      ])

      setProjectStats(projectData || {})
      setInvestorStats(investorData || {})
      setInvestmentStats(investmentData || {})
      setMonthlyInvestmentStats(monthlyInvestmentData || [])
      setMonthlyExpenseStats(monthlyExpenseData || [])
    } catch (error) {
      console.error('통계 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">통계를 불러오는 중...</div>
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
              투자 <span className="text-blue-300">통계</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed mb-12">
              Global BUSAN 프로젝트의 투자 현황과 성과를 실시간으로 확인하세요
            </p>
          </div>
        </section>

        {/* 주요 지표 */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <h2 className="text-3xl font-bold text-white text-center mb-12">주요 지표</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaBuilding className="text-4xl text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{projectStats.total_projects || 0}</div>
                <div className="text-blue-200">총 프로젝트</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaUsers className="text-4xl text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{investorStats.total_investors || 0}</div>
                <div className="text-blue-200">총 투자자</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaDollarSign className="text-4xl text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{formatCurrency(investmentStats.total_investment_amount || 0)}</div>
                <div className="text-blue-200">총 투자금</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <FaChartLine className="text-4xl text-orange-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{investmentStats.total_investments || 0}</div>
                <div className="text-blue-200">총 투자 건수</div>
              </div>
            </div>
          </div>
        </section>

        {/* 투자자 분석 */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <h2 className="text-3xl font-bold text-white text-center mb-12">투자자 분석</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">투자자 현황</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">평균 투자 금액</span>
                    <span className="text-white font-semibold">{formatCurrency(investorStats.avg_investment_per_investor || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">최대 투자 금액</span>
                    <span className="text-white font-semibold">{formatCurrency(investorStats.max_investment || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">최소 투자 금액</span>
                    <span className="text-white font-semibold">{formatCurrency(investorStats.min_investment || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">최근 30일 신규 투자자</span>
                    <span className="text-white font-semibold">{investorStats.new_investors_30_days || 0}명</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">투자 현황</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">확정된 투자</span>
                    <span className="text-green-400 font-semibold">{investmentStats.confirmed_investments || 0}건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">대기 중인 투자</span>
                    <span className="text-yellow-400 font-semibold">{investmentStats.pending_investments || 0}건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">실패한 투자</span>
                    <span className="text-red-400 font-semibold">{investmentStats.failed_investments || 0}건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">최근 30일 투자</span>
                    <span className="text-white font-semibold">{investmentStats.investments_30_days || 0}건</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 월별 투자 추이 */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <h2 className="text-3xl font-bold text-white text-center mb-12">월별 투자 추이</h2>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-4 px-2">월</th>
                      <th className="text-right py-4 px-2">투자 건수</th>
                      <th className="text-right py-4 px-2">투자 금액</th>
                      <th className="text-right py-4 px-2">고유 투자자</th>
                      <th className="text-right py-4 px-2">ETH</th>
                      <th className="text-right py-4 px-2">SOL</th>
                      <th className="text-right py-4 px-2">BTC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyInvestmentStats.map((stat, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-4 px-2">{formatDate(stat.month)}</td>
                        <td className="text-right py-4 px-2">{stat.investment_count}</td>
                        <td className="text-right py-4 px-2">{formatCurrency(stat.total_amount)}</td>
                        <td className="text-right py-4 px-2">{stat.unique_investors}</td>
                        <td className="text-right py-4 px-2">{stat.eth_investments}</td>
                        <td className="text-right py-4 px-2">{stat.sol_investments}</td>
                        <td className="text-right py-4 px-2">{stat.btc_investments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 월별 지출 추이 */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <h2 className="text-3xl font-bold text-white text-center mb-12">월별 지출 추이</h2>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-4 px-2">월</th>
                      <th className="text-right py-4 px-2">지출 건수</th>
                      <th className="text-right py-4 px-2">총 지출</th>
                      <th className="text-right py-4 px-2">개발</th>
                      <th className="text-right py-4 px-2">마케팅</th>
                      <th className="text-right py-4 px-2">인프라</th>
                      <th className="text-right py-4 px-2">법무</th>
                      <th className="text-right py-4 px-2">운영</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyExpenseStats.map((stat, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-4 px-2">{formatDate(stat.month)}</td>
                        <td className="text-right py-4 px-2">{stat.expense_count}</td>
                        <td className="text-right py-4 px-2">{formatCurrency(stat.total_amount)}</td>
                        <td className="text-right py-4 px-2">{formatCurrency(stat.development_amount)}</td>
                        <td className="text-right py-4 px-2">{formatCurrency(stat.marketing_amount)}</td>
                        <td className="text-right py-4 px-2">{formatCurrency(stat.infrastructure_amount)}</td>
                        <td className="text-right py-4 px-2">{formatCurrency(stat.legal_amount)}</td>
                        <td className="text-right py-4 px-2">{formatCurrency(stat.operations_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 암호화폐별 투자 현황 */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <h2 className="text-3xl font-bold text-white text-center mb-12">암호화폐별 투자 현황</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <SiEthereum className="text-6xl text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Ethereum (ETH)</h3>
                <div className="text-3xl font-bold text-white mb-2">
                  {monthlyInvestmentStats.reduce((sum, stat) => sum + stat.eth_investments, 0)}
                </div>
                <div className="text-blue-200">총 투자 건수</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <SiSolana className="text-6xl text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Solana (SOL)</h3>
                <div className="text-3xl font-bold text-white mb-2">
                  {monthlyInvestmentStats.reduce((sum, stat) => sum + stat.sol_investments, 0)}
                </div>
                <div className="text-blue-200">총 투자 건수</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <SiBitcoin className="text-6xl text-orange-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Bitcoin (BTC)</h3>
                <div className="text-3xl font-bold text-white mb-2">
                  {monthlyInvestmentStats.reduce((sum, stat) => sum + stat.btc_investments, 0)}
                </div>
                <div className="text-blue-200">총 투자 건수</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Statistics
