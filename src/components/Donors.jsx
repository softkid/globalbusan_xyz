import React, { useState, useEffect } from 'react'
import { FaUsers, FaHandHoldingHeart, FaTrophy, FaClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { statsService, investorService, investmentService } from '../lib/supabase'
import { t } from '../lib/i18n'

const Donors = () => {
  const [donors, setDonors] = useState([])
  const [topDonors, setTopDonors] = useState([])
  const [recentDonors, setRecentDonors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDonors()
  }, [])

  const loadDonors = async () => {
    try {
      setLoading(true)
      
      // 투자자 및 투자 내역 로드
      const [investorsData, investmentsData] = await Promise.all([
        investorService.getInvestors(),
        investmentService.getInvestments()
      ])

      // 투자자별 총 투자액 계산
      const donorMap = new Map()
      
      investmentsData?.forEach(investment => {
        const investorId = investment.investor_id
        const investor = investorsData?.find(inv => inv.id === investorId)
        const donorName = investor?.name || investor?.email || 'Anonymous'
        
        if (!donorMap.has(investorId)) {
          donorMap.set(investorId, {
            id: investorId,
            name: donorName,
            email: investor?.email || '',
            totalAmount: 0,
            donationCount: 0,
            lastDonation: investment.investment_date
          })
        }
        
        const donor = donorMap.get(investorId)
        donor.totalAmount += parseFloat(investment.amount || 0)
        donor.donationCount += 1
        
        if (new Date(investment.investment_date) > new Date(donor.lastDonation)) {
          donor.lastDonation = investment.investment_date
        }
      })

      const donorsList = Array.from(donorMap.values())
      setDonors(donorsList)

      // 상위 기부자 (총 기부액 기준, 최대 10개)
      const sortedByAmount = [...donorsList].sort((a, b) => b.totalAmount - a.totalAmount)
      setTopDonors(sortedByAmount.slice(0, 10))

      // 최근 기부자 (최근 기부일 기준, 최대 10개)
      const sortedByDate = [...donorsList].sort((a, b) => 
        new Date(b.lastDonation) - new Date(a.lastDonation)
      )
      setRecentDonors(sortedByDate.slice(0, 10))
    } catch (error) {
      console.error('기부자 데이터 로드 실패:', error)
      setDonors([])
      setTopDonors([])
      setRecentDonors([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-5 sm:px-10">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-blue-200">{t('common.loading')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-5 sm:px-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            {t('home.donorsTitle')}
          </h2>
          <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">
            {t('home.donorsSubtitle')}
          </p>
        </div>

        {/* Top Donors */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaTrophy className="text-3xl text-yellow-400" />
              <h3 className="text-3xl font-bold text-white">{t('home.topDonors')}</h3>
            </div>
            <Link
              to="/donation"
              className="text-blue-300 hover:text-blue-200 transition-colors duration-300 flex items-center gap-2"
            >
              {t('donation.donateNow')} →
            </Link>
          </div>

          {topDonors.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
              <p className="text-blue-200 text-lg">{t('common.noData')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {topDonors.map((donor, index) => (
                <div
                  key={donor.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-600' :
                      'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    {index < 3 && (
                      <FaTrophy className={`text-xl ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        'text-orange-400'
                      }`} />
                    )}
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2 truncate">
                    {donor.name}
                  </h4>
                  <p className="text-green-400 font-semibold text-xl mb-1">
                    ${donor.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-blue-200 text-sm">
                    {donor.donationCount}건
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Donors */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <FaClock className="text-3xl text-blue-400" />
            <h3 className="text-3xl font-bold text-white">{t('home.recentDonors')}</h3>
          </div>

          {recentDonors.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
              <p className="text-blue-200 text-lg">{t('common.noData')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <FaUsers className="text-white text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg mb-1 truncate">
                        {donor.name}
                      </h4>
                      <p className="text-blue-200 text-sm truncate">
                        {donor.email || '익명'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-semibold text-lg">
                        ${donor.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-blue-200 text-sm">
                        {donor.donationCount}건 기부
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-200 text-xs">
                        {new Date(donor.lastDonation).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Link
            to="/donation"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300"
          >
            <FaHandHoldingHeart />
            {t('donation.donateNow')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Donors

