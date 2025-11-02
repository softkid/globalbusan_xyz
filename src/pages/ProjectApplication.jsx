import { useState } from 'react'
import { FaFileUpload, FaPaperPlane, FaBuilding, FaFileAlt, FaCheckCircle } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function ProjectApplication() {
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    category: '',
    expectedBudget: '',
    expectedTimeline: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    businessPlan: null,
    additionalDocs: []
  })

  const [submitted, setSubmitted] = useState(false)
  const [uploading, setUploading] = useState(false)

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

  // Google Form URL (실제 사용 시 환경변수로 관리)
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e, fileType) => {
    const files = Array.from(e.target.files)
    if (fileType === 'businessPlan') {
      setFormData(prev => ({
        ...prev,
        businessPlan: files[0] || null
      }))
    } else if (fileType === 'additionalDocs') {
      setFormData(prev => ({
        ...prev,
        additionalDocs: [...prev.additionalDocs, ...files]
      }))
    }
  }

  const removeAdditionalDoc = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalDocs: prev.additionalDocs.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Google Form에 데이터 전송
      const formDataToSend = new FormData()
      
      // Google Form의 entry ID에 맞춰 데이터 추가 (실제 사용 시 맞춰야 함)
      formDataToSend.append('entry.123456789', formData.projectName) // 프로젝트명
      formDataToSend.append('entry.987654321', formData.projectDescription) // 프로젝트 설명
      formDataToSend.append('entry.111222333', formData.category) // 카테고리
      formDataToSend.append('entry.444555666', formData.expectedBudget) // 예상 예산
      formDataToSend.append('entry.777888999', formData.expectedTimeline) // 예상 기간
      formDataToSend.append('entry.101112131', formData.contactName) // 담당자 이름
      formDataToSend.append('entry.141516171', formData.contactEmail) // 이메일
      formDataToSend.append('entry.181920212', formData.contactPhone) // 전화번호

      // 파일 업로드 (Google Form은 파일 직접 업로드가 제한적이므로,
      // 실제로는 Google Drive API나 다른 스토리지 사용 권장)
      if (formData.businessPlan) {
        formDataToSend.append('entry.files', formData.businessPlan)
      }

      // Google Form으로 데이터 전송
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: formDataToSend,
        mode: 'no-cors' // CORS 우회 (Google Forms는 no-cors 모드 필요)
      })

      // 대안: 구글폼 URL로 리다이렉트 (더 안정적)
      // window.open(`https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?entry.123456789=${encodeURIComponent(formData.projectName)}&entry.987654321=${encodeURIComponent(formData.projectDescription)}`, '_blank')
      
      setSubmitted(true)
      
      // 폼 초기화
      setTimeout(() => {
        setFormData({
          projectName: '',
          projectDescription: '',
          category: '',
          expectedBudget: '',
          expectedTimeline: '',
          contactName: '',
          contactEmail: '',
          contactPhone: '',
          businessPlan: null,
          additionalDocs: []
        })
        setSubmitted(false)
      }, 5000)

    } catch (error) {
      console.error('Form submission error:', error)
      alert('신청서 제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setUploading(false)
    }
  }

  // 구글폼으로 직접 이동하는 방법 (더 안정적)
  const redirectToGoogleForm = () => {
    const googleFormUrl = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=pp_url&entry.123456789=${encodeURIComponent(formData.projectName)}&entry.987654321=${encodeURIComponent(formData.projectDescription)}&entry.111222333=${encodeURIComponent(formData.category)}&entry.444555666=${encodeURIComponent(formData.expectedBudget)}&entry.777888999=${encodeURIComponent(formData.expectedTimeline)}&entry.101112131=${encodeURIComponent(formData.contactName)}&entry.141516171=${encodeURIComponent(formData.contactEmail)}&entry.181920212=${encodeURIComponent(formData.contactPhone)}`
    
    window.open(googleFormUrl, '_blank')
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-5 sm:px-10">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8">
              프로젝트 <span className="text-blue-300">신청하기</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed mb-12">
              Global BUSAN 플랫폼에 프로젝트를 신청하고 투자 기회를 만들어보세요
            </p>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16">
          <div className="container mx-auto px-5 sm:px-10">
            <div className="max-w-4xl mx-auto">
              {submitted ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                  <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-white mb-4">신청서가 제출되었습니다!</h2>
                  <p className="text-blue-200 text-lg mb-8">
                    검토 후 담당자가 연락드리겠습니다.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300"
                  >
                    새 신청서 작성
                  </button>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center gap-3 mb-8">
                    <FaBuilding className="text-3xl text-blue-400" />
                    <h2 className="text-3xl font-bold text-white">프로젝트 신청서</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 프로젝트 기본 정보 */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-6">프로젝트 기본 정보</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-semibold mb-2">프로젝트명 *</label>
                          <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleInputChange}
                            required
                            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            placeholder="프로젝트 이름을 입력하세요"
                          />
                        </div>

                        <div>
                          <label className="block text-white font-semibold mb-2">프로젝트 설명 *</label>
                          <textarea
                            name="projectDescription"
                            value={formData.projectDescription}
                            onChange={handleInputChange}
                            required
                            rows="6"
                            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            placeholder="프로젝트의 목적, 계획, 예상 성과 등을 자세히 설명해주세요"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white font-semibold mb-2">카테고리 *</label>
                            <select
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
                            >
                              <option value="">카테고리를 선택하세요</option>
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-gray-900">
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-white font-semibold mb-2">예상 예산 (USD) *</label>
                            <input
                              type="number"
                              name="expectedBudget"
                              value={formData.expectedBudget}
                              onChange={handleInputChange}
                              required
                              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                              placeholder="예상 예산을 입력하세요"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-semibold mb-2">예상 개발 기간 *</label>
                          <input
                            type="text"
                            name="expectedTimeline"
                            value={formData.expectedTimeline}
                            onChange={handleInputChange}
                            required
                            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            placeholder="예: 6개월, 1년 등"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 담당자 정보 */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-6">담당자 정보</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-semibold mb-2">담당자 이름 *</label>
                          <input
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            required
                            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            placeholder="담당자 이름을 입력하세요"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white font-semibold mb-2">이메일 *</label>
                            <input
                              type="email"
                              name="contactEmail"
                              value={formData.contactEmail}
                              onChange={handleInputChange}
                              required
                              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                              placeholder="이메일 주소를 입력하세요"
                            />
                          </div>

                          <div>
                            <label className="block text-white font-semibold mb-2">전화번호</label>
                            <input
                              type="tel"
                              name="contactPhone"
                              value={formData.contactPhone}
                              onChange={handleInputChange}
                              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                              placeholder="전화번호를 입력하세요"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 문서 업로드 */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-6">문서 업로드</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-semibold mb-2">
                            사업 계획서 <span className="text-blue-300">(PDF, DOCX, 최대 10MB)</span>
                          </label>
                          <div className="flex items-center gap-4">
                            <label className="flex-1 cursor-pointer">
                              <div className="bg-white/10 border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:bg-white/15 transition-colors duration-300">
                                <FaFileUpload className="text-3xl text-blue-400 mx-auto mb-3" />
                                <p className="text-white font-semibold">
                                  {formData.businessPlan ? formData.businessPlan.name : '파일 선택하기'}
                                </p>
                                <p className="text-blue-200 text-sm mt-2">클릭하여 파일 선택</p>
                              </div>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileChange(e, 'businessPlan')}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-semibold mb-2">
                            추가 문서 <span className="text-blue-300">(선택사항, 최대 3개)</span>
                          </label>
                          <div className="space-y-3">
                            <label className="block cursor-pointer">
                              <div className="bg-white/10 border-2 border-dashed border-white/30 rounded-xl p-4 text-center hover:bg-white/15 transition-colors duration-300">
                                <FaFileAlt className="text-xl text-blue-400 mx-auto mb-2" />
                                <p className="text-blue-200 text-sm">추가 문서 선택</p>
                              </div>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.xlsx,.xls"
                                onChange={(e) => handleFileChange(e, 'additionalDocs')}
                                className="hidden"
                              />
                            </label>
                            
                            {formData.additionalDocs.length > 0 && (
                              <div className="space-y-2">
                                {formData.additionalDocs.map((file, index) => (
                                  <div key={index} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <FaFileAlt className="text-blue-400" />
                                      <span className="text-white text-sm">{file.name}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeAdditionalDoc(index)}
                                      className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                      삭제
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 제출 버튼 */}
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            제출 중...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="text-xl" />
                            신청서 제출
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={redirectToGoogleForm}
                        className="px-8 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition-colors duration-300 flex items-center gap-2"
                      >
                        <FaFileAlt />
                        구글폼으로 이동
                      </button>
                    </div>
                  </form>
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

export default ProjectApplication

