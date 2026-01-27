import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { FaChartLine, FaDollarSign, FaUsers, FaProjectDiagram, FaCalendarAlt, FaArrowUp } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { statsService, projectService, investmentService, expenseService } from '../lib/supabase'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

function Status() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])
  const [investments, setInvestments] = useState([])
  const [expenses, setExpenses] = useState([])
  const [timeSeriesData, setTimeSeriesData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [projectData, setProjectData] = useState([])

  useEffect(() => {
    loadAllData()
    
    // 실시간 업데이트를 위한 인터벌 (30초마다)
    const interval = setInterval(() => {
      loadAllData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      
      // 통계 데이터 로드
      const [projectStats, investorStats, investmentStats, expenseStats] = await Promise.all([
        statsService.getProjectStats(),
        statsService.getInvestorStats(),
        statsService.getInvestmentStats(),
        statsService.getProjectExpenseStats()
      ])

      setStats({
        project: projectStats,
        investor: investorStats,
        investment: investmentStats,
        expense: expenseStats
      })

      // 프로젝트 데이터 로드
      const projectsData = await projectService.getProjects()
      setProjects(projectsData || [])

      // 투자 데이터 로드
      const investmentsData = await investmentService.getInvestments()
      setInvestments(investmentsData || [])

      // 지출 데이터 로드
      const expensesData = await expenseService.getExpenses()
      setExpenses(expensesData || [])

      // 시계열 데이터 생성
      generateTimeSeriesData(investmentsData || [], expensesData || [])
      
      // 카테고리별 데이터 생성
      generateCategoryData(expensesData || [])
      
      // 프로젝트별 데이터 생성
      generateProjectData(projectsData || [], investmentsData || [])

    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateTimeSeriesData = (investments, expenses) => {
    const monthlyData = {}
    
    // 투자 데이터 처리
    investments.forEach(inv => {
      const date = new Date(inv.investment_date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, investments: 0, expenses: 0, net: 0 }
      }
      monthlyData[monthKey].investments += inv.amount || 0
    })

    // 지출 데이터 처리
    expenses.forEach(exp => {
      const date = new Date(exp.expense_date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, investments: 0, expenses: 0, net: 0 }
      }
      monthlyData[monthKey].expenses += exp.amount || 0
    })

    // 순이익 계산 및 정렬
    const data = Object.values(monthlyData).map(item => ({
      ...item,
      net: item.investments - item.expenses
    })).sort((a, b) => a.month.localeCompare(b.month))

    setTimeSeriesData(data)
  }

  const generateCategoryData = (expenses) => {
    const categoryMap = {}
    
    expenses.forEach(exp => {
      const category = exp.category || '기타'
      if (!categoryMap[category]) {
        categoryMap[category] = 0
      }
      categoryMap[category] += exp.amount || 0
    })

    const data = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }))

    setCategoryData(data)
  }

  const generateProjectData = (projects, investments) => {
    const projectMap = {}
    
    // 프로젝트별 투자 집계
    investments.forEach(inv => {
      const projectId = inv.project_id
      if (!projectMap[projectId]) {
        const project = projects.find(p => p.id === projectId)
        projectMap[projectId] = {
          name: project?.title || `프로젝트 ${projectId}`,
          raised: 0,
          budget: project?.budget || 0,
          progress: 0
        }
      }
      projectMap[projectId].raised += inv.amount || 0
    })

    // 진행률 계산
    Object.values(projectMap).forEach(proj => {
      proj.progress = proj.budget > 0 ? (proj.raised / proj.budget) * 100 : 0
    })

    const data = Object.values(projectMap).sort((a, b) => b.raised - a.raised)
    setProjectData(data)
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <SEO
          title={t('status.title') + ' - Global BUSAN'}
          description={t('status.description')}
          url="https://globalbusan.xyz/status"
        />
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-5 sm:px-10 py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <div className="text-white text-xl">{t('common.loading')}</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const totalRaised = stats?.project?.total_raised || 0
  const totalInvestors = stats?.investor?.total_investors || 0
  const totalProjects = stats?.project?.total_projects || 0
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
  const netProfit = totalRaised - totalExpenses

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <SEO
        title={t('status.title') + ' - Global BUSAN'}
        description={t('status.description')}
        url="https://globalbusan.xyz/status"
      />
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-5 sm:px-10 py-10">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <FaChartLine />
              {t('status.title')}
            </h1>
            <p className="text-blue-200">{t('status.description')}</p>
          </div>

          {/* 주요 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <FaDollarSign className="text-3xl text-green-400" />
                <span className="text-blue-200 text-sm">{t('status.totalRaised')}</span>
              </div>
              <div className="text-3xl font-bold text-white">${totalRaised.toLocaleString()}</div>
              <div className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <FaArrowUp />
                {t('status.realTime')}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <FaUsers className="text-3xl text-blue-400" />
                <span className="text-blue-200 text-sm">{t('status.totalInvestors')}</span>
              </div>
              <div className="text-3xl font-bold text-white">{totalInvestors}</div>
              <div className="text-blue-400 text-sm mt-2 flex items-center gap-1">
                <FaArrowUp />
                {t('status.realTime')}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <FaProjectDiagram className="text-3xl text-purple-400" />
                <span className="text-blue-200 text-sm">{t('status.totalProjects')}</span>
              </div>
              <div className="text-3xl font-bold text-white">{totalProjects}</div>
              <div className="text-purple-400 text-sm mt-2 flex items-center gap-1">
                <FaCalendarAlt />
                {t('status.active')}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <FaChartLine className="text-3xl text-yellow-400" />
                <span className="text-blue-200 text-sm">{t('status.netProfit')}</span>
              </div>
              <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${netProfit.toLocaleString()}
              </div>
              <div className="text-yellow-400 text-sm mt-2 flex items-center gap-1">
                <FaChartLine />
                {t('status.calculated')}
              </div>
            </div>
          </div>

          {/* 그래프 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 시계열 차트 - 투자 및 지출 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">{t('status.investmentExpenseTrend')}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #ffffff20' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="investments" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInvestments)" name={t('status.investments')} />
                  <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" name={t('status.expenses')} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 순이익 추이 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">{t('status.netProfitTrend')}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #ffffff20' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2} name={t('status.netProfit')} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 프로젝트별 투자 현황 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">{t('status.projectInvestments')}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="name" stroke="#ffffff80" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #ffffff20' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="raised" fill="#3b82f6" name={t('status.raised')} />
                  <Bar dataKey="budget" fill="#8b5cf6" name={t('status.budget')} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 카테고리별 지출 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">{t('status.expenseByCategory')}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #ffffff20' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 프로젝트 진행률 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">{t('status.projectProgress')}</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={projectData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis type="number" stroke="#ffffff80" />
                <YAxis dataKey="name" type="category" stroke="#ffffff80" width={150} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #ffffff20' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="progress" fill="#10b981" name={t('status.progress') + ' (%)'} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 실시간 업데이트 표시 */}
          <div className="text-center text-blue-200 text-sm">
            <FaChartLine className="inline mr-2" />
            {t('status.lastUpdated')}: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Status

