import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaShieldAlt, FaLock, FaUserShield, FaFileContract, FaArrowLeft } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { useTranslation } from 'react-i18next'

function Privacy() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const currentLang = i18n.language || 'ko'

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <SEO
        title="개인정보처리방침 - Global BUSAN"
        description="Global BUSAN의 개인정보 보호 정책 및 처리 방침"
        keywords="개인정보, 프라이버시, 데이터 보호, GDPR, 개인정보처리방침"
        url="https://globalbusan.xyz/privacy"
      />
      <Navbar />
      
      <div className="container mx-auto px-5 sm:px-10 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-8 transition-colors"
          >
            <FaArrowLeft />
            <span>홈으로 돌아가기</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-5xl text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              개인정보처리방침
            </h1>
            <p className="text-xl text-blue-200">
              Privacy Policy
            </p>
            <p className="text-sm text-blue-300 mt-4">
              최종 수정일: 2026년 1월 24일
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20">
            <div className="prose prose-invert prose-lg max-w-none">
              
              {/* Section 1 */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <FaFileContract className="text-3xl text-blue-400" />
                  <h2 className="text-2xl font-bold text-white m-0">1. 개인정보의 수집 및 이용 목적</h2>
                </div>
                <div className="text-blue-100 space-y-4">
                  <p>
                    GOLDSAJU("회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 
                    처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
                    이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                    <li>투자 및 기부 서비스 제공: 투자금 관리, 기부금 관리, 거래 내역 확인</li>
                    <li>블록체인 거래 처리: 암호화폐 지갑 연동, 트랜잭션 검증</li>
                    <li>고객 문의 대응: 문의사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</li>
                    <li>마케팅 및 광고: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공</li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <FaLock className="text-3xl text-blue-400" />
                  <h2 className="text-2xl font-bold text-white m-0">2. 수집하는 개인정보 항목</h2>
                </div>
                <div className="text-blue-100 space-y-4">
                  <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
                  
                  <div className="bg-blue-900/30 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">필수항목</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>이메일 주소</li>
                      <li>이름 (Google 계정 연동 시)</li>
                      <li>프로필 사진 (Google 계정 연동 시)</li>
                      <li>암호화폐 지갑 주소 (투자/기부 시)</li>
                    </ul>
                  </div>

                  <div className="bg-blue-900/30 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">자동 수집 항목</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>IP 주소</li>
                      <li>쿠키</li>
                      <li>접속 로그</li>
                      <li>서비스 이용 기록</li>
                      <li>기기 정보 (OS, 브라우저 정보 등)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <FaUserShield className="text-3xl text-blue-400" />
                  <h2 className="text-2xl font-bold text-white m-0">3. 개인정보의 보유 및 이용기간</h2>
                </div>
                <div className="text-blue-100 space-y-4">
                  <p>
                    회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
                    동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)</li>
                    <li>거래 관련 정보: 5년 (전자상거래법)</li>
                    <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                    <li>접속 로그 기록: 3개월 (통신비밀보호법)</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">4. 개인정보의 제3자 제공</h2>
                <div className="text-blue-100 space-y-4">
                  <p>
                    회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 
                    다만, 아래의 경우에는 예외로 합니다:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>이용자가 사전에 동의한 경우</li>
                    <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">5. 정보주체의 권리·의무 및 행사방법</h2>
                <div className="text-blue-100 space-y-4">
                  <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>개인정보 열람 요구</li>
                    <li>오류 등이 있을 경우 정정 요구</li>
                    <li>삭제 요구</li>
                    <li>처리정지 요구</li>
                  </ul>
                  <p className="mt-4">
                    권리 행사는 회사에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며 
                    회사는 이에 대해 지체없이 조치하겠습니다.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">6. 개인정보의 파기</h2>
                <div className="text-blue-100 space-y-4">
                  <p>
                    회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
                    지체없이 해당 개인정보를 파기합니다.
                  </p>
                  <div className="bg-blue-900/30 rounded-lg p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">파기 방법</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>전자적 파일 형태: 복구 및 재생되지 않도록 안전하게 삭제</li>
                      <li>기록물, 인쇄물, 서면 등: 분쇄 또는 소각</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">7. 개인정보 보호책임자</h2>
                <div className="text-blue-100 space-y-4">
                  <p>
                    회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 
                    개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 
                    아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                  </p>
                  <div className="bg-blue-900/30 rounded-lg p-6 space-y-2">
                    <p><strong>▶ 개인정보 보호책임자</strong></p>
                    <p>회사명: GOLDSAJU</p>
                    <p>이메일: contact@goldsaju.com</p>
                  </div>
                </div>
              </section>

              {/* Section 8 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">8. 개인정보 처리방침 변경</h2>
                <div className="text-blue-100 space-y-4">
                  <p>
                    이 개인정보처리방침은 2026년 1월 24일부터 적용됩니다. 
                    법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 
                    변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                  </p>
                </div>
              </section>

              {/* Contact Info */}
              <section className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 mt-12">
                <h3 className="text-2xl font-bold text-white mb-4">문의하기</h3>
                <p className="text-blue-100 mb-4">
                  개인정보 보호와 관련하여 문의사항이 있으시면 언제든지 연락주시기 바랍니다.
                </p>
                <a 
                  href="mailto:contact@goldsaju.com" 
                  className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-lg font-semibold transition-colors"
                >
                  contact@goldsaju.com
                </a>
              </section>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default Privacy
