import { useState, useEffect } from 'react'
import { FaEnvelope, FaUser, FaBuilding, FaUsers, FaHandshake, FaChartLine, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { t } from '../lib/i18n'

function GlobalBusan() {
  const [teamInfo, setTeamInfo] = useState({
    mission: '',
    vision: '',
    description: '',
    teamMembers: []
  })
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    type: 'inquiry' // 'inquiry' or 'partnership'
  })
  const [submitting, setSubmitting] = useState(false)
  const [partners, setPartners] = useState([])

  useEffect(() => {
    // 팀 정보 및 파트너 정보 로드 (실제로는 API에서 가져옴)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // 실제로는 API 호출
      setTeamInfo({
        mission: '부산을 글로벌 비즈니스 허브로 변화시키기',
        vision: '블록체인 기반 투명한 투자 플랫폼을 통해 국제 기업가와 한국 비즈니스 생태계를 연결',
        description: 'Global BUSAN은 혁신적인 블록체인 기술을 활용하여 투자와 기부의 투명성을 보장하고, 부산을 아시아의 주요 비즈니스 허브로 성장시키는 것을 목표로 합니다.',
        teamMembers: [
          { name: '김부산', role: 'CEO', email: 'ceo@globalbusan.com' },
          { name: '이글로벌', role: 'CTO', email: 'cto@globalbusan.com' },
          { name: '박투자', role: 'CFO', email: 'cfo@globalbusan.com' }
        ]
      })

      // 파트너 로고 (실제로는 서버에서 이미지 URL 가져옴)
      setPartners([
        { name: 'Project Partner 1', logo: '/logo-placeholder.png', type: 'project', website: 'https://example.com' },
        { name: 'Investment Partner 1', logo: '/logo-placeholder.png', type: 'investment', website: 'https://example.com' },
        { name: 'Venture Capital Association', logo: '/logo-placeholder.png', type: 'association', website: 'https://example.com' },
        { name: 'Project Partner 2', logo: '/logo-placeholder.png', type: 'project', website: 'https://example.com' },
        { name: 'Investment Partner 2', logo: '/logo-placeholder.png', type: 'investment', website: 'https://example.com' },
        { name: 'Tech Venture Association', logo: '/logo-placeholder.png', type: 'association', website: 'https://example.com' }
      ])
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // 실제로는 이메일 API 또는 백엔드로 전송
      const emailBody = `
${contactForm.type === 'inquiry' ? '문의' : '제휴'} 요청

이름: ${contactForm.name}
이메일: ${contactForm.email}
회사: ${contactForm.company || 'N/A'}
제목: ${contactForm.subject}
메시지:
${contactForm.message}
      `.trim()

      // mailto 링크로 이메일 클라이언트 열기
      const mailtoLink = `mailto:info@globalbusan.com?subject=${encodeURIComponent(contactForm.subject)}&body=${encodeURIComponent(emailBody)}`
      window.location.href = mailtoLink

      alert('이메일 클라이언트가 열렸습니다. 메일을 확인하고 보내주세요.')
      
      // 폼 초기화
      setContactForm({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        type: contactForm.type
      })
    } catch (error) {
      console.error('제출 실패:', error)
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const getPartnerTypeLabel = (type) => {
    switch (type) {
      case 'project': return '프로젝트 참여사'
      case 'investment': return '협업 투자사'
      case 'association': return '벤처투자협회'
      default: return '파트너'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-5 sm:px-10">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8">
              Global <span className="text-blue-300">BUSAN</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              부산을 글로벌 비즈니스 허브로 만들어가는 혁신적인 플랫폼
            </p>
          </div>
        </section>

        {/* Team Info Section */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-12">팀 정보</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaChartLine className="text-white text-3xl" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">미션</h3>
                  <p className="text-blue-200 text-center">
                    {teamInfo.mission || '부산을 글로벌 비즈니스 허브로 변화시키기'}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                      <FaGlobe className="text-white text-3xl" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">비전</h3>
                  <p className="text-blue-200 text-center">
                    {teamInfo.vision || '블록체인 기반 투명한 투자 플랫폼 구축'}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                      <FaUsers className="text-white text-3xl" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">팀 구성</h3>
                  <p className="text-blue-200 text-center">
                    {teamInfo.teamMembers.length}명의 전문가들로 구성
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
                <h3 className="text-2xl font-bold text-white mb-4">프로젝트 소개</h3>
                <p className="text-blue-200 leading-relaxed">
                  {teamInfo.description || 'Global BUSAN은 혁신적인 블록체인 기술을 활용하여 투자와 기부의 투명성을 보장하고, 부산을 아시아의 주요 비즈니스 허브로 성장시키는 것을 목표로 합니다.'}
                </p>
              </div>

              {/* Team Members */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">팀 멤버</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {teamInfo.teamMembers.map((member, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <FaUser className="text-white text-xl" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg">{member.name}</h4>
                          <p className="text-blue-200 text-sm">{member.role}</p>
                        </div>
                      </div>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-blue-300 hover:text-blue-200 text-sm flex items-center gap-2 transition-colors duration-300"
                      >
                        <FaEnvelope />
                        {member.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Partnership Section */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-12">문의 및 제휴</h2>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setContactForm(prev => ({ ...prev, type: 'inquiry' }))}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      contactForm.type === 'inquiry'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-blue-200 hover:bg-white/20'
                    }`}
                  >
                    <FaEnvelope className="inline mr-2" />
                    문의하기
                  </button>
                  <button
                    onClick={() => setContactForm(prev => ({ ...prev, type: 'partnership' }))}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      contactForm.type === 'partnership'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-blue-200 hover:bg-white/20'
                    }`}
                  >
                    <FaHandshake className="inline mr-2" />
                    제휴 문의
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">이름 *</label>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                        placeholder="이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">이메일 *</label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                        placeholder="이메일을 입력하세요"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">회사명 (선택)</label>
                    <input
                      type="text"
                      name="company"
                      value={contactForm.company}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="회사명을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">제목 *</label>
                    <input
                      type="text"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="제목을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">메시지 *</label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="메시지를 입력하세요"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        전송 중...
                      </>
                    ) : (
                      <>
                        <FaEnvelope />
                        이메일로 보내기
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-12">파트너 및 협력사</h2>
              
              {/* Partners by Type */}
              {['project', 'investment', 'association'].map(type => {
                const typePartners = partners.filter(p => p.type === type)
                if (typePartners.length === 0) return null

                return (
                  <div key={type} className="mb-12">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <FaBuilding className="text-blue-400" />
                      {getPartnerTypeLabel(type)}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {typePartners.map((partner, index) => (
                        <a
                          key={index}
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 flex flex-col items-center justify-center min-h-[150px]"
                        >
                          <div className="w-20 h-20 bg-white/10 rounded-lg mb-4 flex items-center justify-center">
                            {partner.logo && partner.logo !== '/logo-placeholder.png' ? (
                              <img
                                src={partner.logo}
                                alt={partner.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <FaBuilding className="text-blue-400 text-3xl" />
                            )}
                          </div>
                          <p className="text-white font-semibold text-center text-sm">{partner.name}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )
              })}

              {partners.length === 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                  <p className="text-blue-200 text-lg">파트너 정보가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default GlobalBusan

