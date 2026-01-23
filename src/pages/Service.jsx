import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaFileContract, FaGavel, FaHandshake, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { useTranslation } from 'react-i18next'

function Service() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <SEO
        title="서비스 이용약관 - Global BUSAN"
        description="Global BUSAN 플랫폼의 서비스 이용 약관 및 조건"
        keywords="이용약관, 서비스약관, 투자약관, 블록체인, 약관"
        url="https://globalbusan.xyz/service"
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
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center">
                <FaFileContract className="text-5xl text-purple-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              서비스 이용약관
            </h1>
            <p className="text-xl text-blue-200">
              Terms of Service
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
                  <FaHandshake className="text-3xl text-purple-400" />
                  <h2 className="text-2xl font-bold text-white m-0">제1조 (목적)</h2>
                </div>
                <div className="text-blue-100 space-y-4">
                  <p>
                    본 약관은 GOLDSAJU("회사")가 운영하는 Global BUSAN 플랫폼(이하 "서비스")의 
                    이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">제2조 (용어의 정의)</h2>
                <div className="text-blue-100 space-y-4">
                  <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>"서비스"</strong>란 회사가 제공하는 Global BUSAN 플랫폼 및 관련 제반 서비스를 의미합니다.</li>
                    <li><strong>"회원"</strong>이란 회사의 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
                    <li><strong>"투자"</strong>란 회원이 서비스를 통해 프로젝트에 자금을 제공하는 행위를 의미합니다.</li>
                    <li><strong>"기부"</strong>란 회원이 대가 없이 서비스 운영 또는 프로젝트에 자금을 제공하는 행위를 의미합니다.</li>
                    <li><strong>"지갑"</strong>이란 암호화폐를 보관하고 거래할 수 있는 블록체인 지갑을 의미합니다.</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <FaGavel className="text-3xl text-purple-400" />
                  <h2 className="text-2xl font-bold text-white m-0">제3조 (약관의 효력 및 변경)</h2>
                </div>
                <div className="text-blue-100 space-y-4">
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력을 발생합니다.</li>
                    <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.</li>
                    <li>약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터 서비스 내 공지사항을 통해 공지합니다.</li>
                    <li>회원이 변경된 약관에 동의하지 않는 경우, 회원은 서비스 이용을 중단하고 이용계약을 해지할 수 있습니다.</li>
                  </ol>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">제4조 (회원가입)</h2>
                <div className="text-blue-100 space-y-4">
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li>회원가입은 이용자가 약관의 내용에 대하여 동의를 한 다음 회원가입 신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</li>
                    <li>회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다:
                      <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                        <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                        <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                        <li>부정한 용도로 서비스를 사용하고자 하는 경우</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">제5조 (투자 및 기부)</h2>
                <div className="text-blue-100 space-y-4">
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li>회원은 서비스를 통해 프로젝트에 투자하거나 플랫폼에 기부할 수 있습니다.</li>
                    <li>투자 및 기부는 블록체인 기술을 통해 처리되며, 거래의 투명성이 보장됩니다.</li>
                    <li>투자금은 프로젝트의 성과에 따라 수익이 발생할 수 있으나, 원금 손실의 위험이 있습니다.</li>
                    <li>기부금은 반환되지 않으며, 플랫폼 운영 및 프로젝트 지원에 사용됩니다.</li>
                    <li>회원은 투자 또는 기부를 실행하기 전에 관련 정보를 충분히 검토해야 합니다.</li>
                  </ol>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">제6조 (회원의 의무)</h2>
                <div className="text-blue-100 space-y-4">
                  <p>회원은 다음 행위를 하여서는 안됩니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>신청 또는 변경 시 허위내용의 등록</li>
                    <li>타인의 정보도용</li>
                    <li>회사가 게시한 정보의 변경</li>
                    <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                    <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                    <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                    <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                    <li>자금세탁, 불법거래 등 범죄행위와 관련된 활동</li>
                  </ul>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">제7조 (회사의 의무)</h2>
                <div className="text-blue-100 space-y-4">
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li>회사는 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 본 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하는데 최선을 다하여야 합니다.</li>
                    <li>회사는 회원이 안전하게 서비스를 이용할 수 있도록 회원의 개인정보 보호를 위한 보안 시스템을 갖추어야 합니다.</li>
                    <li>회사는 서비스 이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 인정할 경우에는 이를 처리하여야 합니다.</li>
                  </ol>
                </div>
              </section>

              {/* Section 8 */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <FaExclamationTriangle className="text-3xl text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white m-0">제8조 (면책조항)</h2>
                </div>
                <div className="text-blue-100 space-y-4">
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
                    <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
                    <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</li>
                    <li>회사는 블록체인 네트워크의 장애, 암호화폐 가격 변동 등으로 인한 손실에 대해 책임을 지지 않습니다.</li>
                    <li>투자는 원금 손실의 위험을 동반하며, 모든 투자 결정에 대한 책임은 회원 본인에게 있습니다.</li>
                  </ol>
                </div>
              </section>

              {/* Section 9 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">제9조 (분쟁의 해결)</h2>
                <div className="text-blue-100 space-y-4">
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li>회사는 회원이 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.</li>
                    <li>회사와 회원 간 발생한 분쟁에 관한 소송은 대한민국 법을 준거법으로 하며, 회사의 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.</li>
                  </ol>
                </div>
              </section>

              {/* Risk Warning */}
              <section className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl p-8 border-2 border-red-500/50">
                <div className="flex items-start gap-4">
                  <FaExclamationTriangle className="text-4xl text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">투자 위험 고지</h3>
                    <div className="text-red-100 space-y-3">
                      <p>
                        <strong>본 서비스를 통한 투자는 높은 위험을 수반합니다.</strong> 
                        투자 원금의 전부 또는 일부를 잃을 수 있으며, 이는 투자자 본인의 책임입니다.
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>암호화폐 투자는 가격 변동성이 매우 크며, 규제 변경 등의 위험이 있습니다.</li>
                        <li>스타트업 및 프로젝트 투자는 실패 가능성이 높습니다.</li>
                        <li>블록체인 거래는 되돌릴 수 없으므로 신중하게 진행하십시오.</li>
                        <li>투자 전 충분한 조사와 전문가 상담을 권장합니다.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Additional Info */}
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6">부칙</h2>
                <div className="text-blue-100 space-y-4">
                  <p><strong>제1조 (시행일)</strong></p>
                  <p>본 약관은 2026년 1월 24일부터 시행됩니다.</p>
                </div>
              </section>

              {/* Contact Info */}
              <section className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 mt-12">
                <h3 className="text-2xl font-bold text-white mb-4">문의하기</h3>
                <p className="text-blue-100 mb-4">
                  서비스 이용과 관련하여 문의사항이 있으시면 언제든지 연락주시기 바랍니다.
                </p>
                <div className="space-y-2">
                  <p className="text-blue-100">
                    <strong>회사명:</strong> GOLDSAJU
                  </p>
                  <p>
                    <strong>이메일:</strong>{' '}
                    <a 
                      href="mailto:contact@goldsaju.com" 
                      className="text-blue-300 hover:text-white transition-colors"
                    >
                      contact@goldsaju.com
                    </a>
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default Service
