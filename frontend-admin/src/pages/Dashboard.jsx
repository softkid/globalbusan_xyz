import { useState, useEffect } from 'react'
import { FaHandHoldingHeart, FaChartLine, FaProjectDiagram, FaUsers } from 'react-icons/fa'
import axios from 'axios'

const Dashboard = () => {
  const [stats, setStats] = useState({
    donations: { total: 0, count: 0 },
    investments: { total: 0, count: 0 },
    overall: { total: 0, count: 0 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Donations',
      value: `${stats.donations.total.toFixed(2)} SUI`,
      count: `${stats.donations.count} donations`,
      icon: FaHandHoldingHeart,
      color: 'bg-green-500'
    },
    {
      title: 'Total Investments',
      value: `${stats.investments.total.toFixed(2)} SUI`,
      count: `${stats.investments.count} investments`,
      icon: FaChartLine,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Revenue',
      value: `${stats.overall.total.toFixed(2)} SUI`,
      count: `${stats.overall.count} transactions`,
      icon: FaProjectDiagram,
      color: 'bg-purple-500'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-semibold">{stat.title}</h3>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-2">{stat.count}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <p className="text-gray-600">Activity feed coming soon...</p>
      </div>
    </div>
  )
}

export default Dashboard
