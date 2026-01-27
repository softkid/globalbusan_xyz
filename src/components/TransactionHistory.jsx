import React, { useState, useEffect } from 'react'
import { FaHistory, FaDownload, FaExternalLinkAlt, FaCheckCircle, FaClock } from 'react-icons/fa'
import { useSuiDonation } from '../hooks/useSuiDonation'
import { useSuiInvestment } from '../hooks/useSuiInvestment'

const TransactionHistory = () => {
  const { getDonationHistory } = useSuiDonation()
  const { getInvestmentHistory } = useSuiInvestment()

  const [activeTab, setActiveTab] = useState('donations') // donations, investments, all
  const [donations, setDonations] = useState([])
  const [investments, setInvestments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date-desc') // date-desc, date-asc, amount-desc, amount-asc

  useEffect(() => {
    const donationHistory = getDonationHistory()
    const investmentHistory = getInvestmentHistory()
    setDonations(donationHistory)
    setInvestments(investmentHistory)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getExplorerUrl = (digest) => {
    return `https://suiscan.xyz/testnet/tx/${digest}`
  }

  const getFilteredAndSortedData = () => {
    let data = []

    if (activeTab === 'donations' || activeTab === 'all') {
      data = [...data, ...donations.map(d => ({
        ...d,
        type: 'donation',
        amount: d.amount,
        description: `${d.donorName || 'Anonymous'} - 기부`,
        timestamp: d.timestamp
      }))]
    }

    if (activeTab === 'investments' || activeTab === 'all') {
      data = [...data, ...investments.map(i => ({
        ...i,
        type: 'investment',
        amount: i.amount,
        description: `${i.projectName} - 투자`,
        timestamp: i.timestamp
      }))]
    }

    // Filter by search term
    if (searchTerm) {
      data = data.filter(item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.digest?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    data.sort((a, b) => {
      const aAmount = parseFloat(a.amount)
      const bAmount = parseFloat(b.amount)
      const aDate = new Date(a.timestamp)
      const bDate = new Date(b.timestamp)

      switch (sortBy) {
        case 'date-desc':
          return bDate - aDate
        case 'date-asc':
          return aDate - bDate
        case 'amount-desc':
          return bAmount - aAmount
        case 'amount-asc':
          return aAmount - bAmount
        default:
          return 0
      }
    })

    return data
  }

  const allTransactions = getFilteredAndSortedData()

  const totalAmount = allTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0)
  const donationCount = donations.length
  const investmentCount = investments.length

  const downloadCSV = () => {
    const headers = ['Type', 'Amount (SUI)', 'Description', 'Date', 'Transaction Digest']
    const rows = allTransactions.map(t => [
      t.type === 'donation' ? '기부' : '투자',
      t.amount,
      t.description,
      formatDate(t.timestamp),
      t.digest || '-'
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `transaction_history_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaHistory className="text-4xl text-blue-400" />
            <h1 className="text-5xl font-bold text-white">거래 히스토리</h1>
          </div>
          <p className="text-gray-300 text-lg">모든 기부와 투자 기록을 확인하세요</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-700">
            <p className="text-blue-300 text-sm font-semibold mb-2">총 거래액</p>
            <p className="text-white text-3xl font-bold">{totalAmount.toFixed(2)}</p>
            <p className="text-blue-300 text-xs mt-2">SUI</p>
          </div>

          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-700">
            <p className="text-green-300 text-sm font-semibold mb-2">기부 건수</p>
            <p className="text-white text-3xl font-bold">{donationCount}</p>
            <p className="text-green-300 text-xs mt-2">건</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-700">
            <p className="text-purple-300 text-sm font-semibold mb-2">투자 건수</p>
            <p className="text-white text-3xl font-bold">{investmentCount}</p>
            <p className="text-purple-300 text-xs mt-2">건</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-6 border border-orange-700">
            <p className="text-orange-300 text-sm font-semibold mb-2">평균 거래액</p>
            <p className="text-white text-3xl font-bold">
              {(donationCount + investmentCount > 0 ? totalAmount / (donationCount + investmentCount) : 0).toFixed(2)}
            </p>
            <p className="text-orange-300 text-xs mt-2">SUI</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tab Selection */}
            <div className="md:col-span-1">
              <label className="block text-white text-sm font-semibold mb-2">거래 유형</label>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">전체</option>
                <option value="donations">기부만</option>
                <option value="investments">투자만</option>
              </select>
            </div>

            {/* Search */}
            <div className="md:col-span-1">
              <label className="block text-white text-sm font-semibold mb-2">검색</label>
              <input
                type="text"
                placeholder="설명 또는 해시로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
              />
            </div>

            {/* Sort */}
            <div className="md:col-span-1">
              <label className="block text-white text-sm font-semibold mb-2">정렬</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="date-desc">최신순</option>
                <option value="date-asc">오래된순</option>
                <option value="amount-desc">금액 (높음→낮음)</option>
                <option value="amount-asc">금액 (낮음→높음)</option>
              </select>
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-4">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              <FaDownload />
              CSV로 다운로드
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {allTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">유형</th>
                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">설명</th>
                    <th className="px-6 py-4 text-right text-white font-semibold text-sm">금액 (SUI)</th>
                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">날짜</th>
                    <th className="px-6 py-4 text-center text-white font-semibold text-sm">거래 링크</th>
                  </tr>
                </thead>
                <tbody>
                  {allTransactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'donation' ? (
                            <div className="flex items-center gap-2 text-green-400">
                              <FaCheckCircle className="text-sm" />
                              <span className="text-sm font-semibold">기부</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-purple-400">
                              <FaClock className="text-sm" />
                              <span className="text-sm font-semibold">투자</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium">{transaction.description}</p>
                        {transaction.notes && (
                          <p className="text-gray-400 text-xs mt-1">{transaction.notes}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-white font-bold text-sm">{parseFloat(transaction.amount).toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300 text-sm">{formatDate(transaction.timestamp)}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {transaction.digest ? (
                          <a
                            href={getExplorerUrl(transaction.digest)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors duration-200"
                          >
                            <FaExternalLinkAlt className="text-xs" />
                            보기
                          </a>
                        ) : (
                          <span className="text-gray-500 text-xs">보류 중</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 text-lg">거래 기록이 없습니다</p>
              <p className="text-gray-500 text-sm mt-2">기부하거나 투자하면 여기에 표시됩니다</p>
            </div>
          )}
        </div>

        {/* Info Message */}
        <div className="mt-8 p-6 bg-blue-900 border border-blue-700 rounded-lg">
          <p className="text-blue-200 text-sm">
            💡 <span className="font-semibold">팁:</span> 모든 거래는 Sui 블록체인 테스트넷에 기록됩니다. 거래 링크를 클릭하면 SuiScan 탐색기에서 자세한 내용을 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory
