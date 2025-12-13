import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import EquityStructure from '../components/EquityStructure'
import Reports from '../components/Reports'
import Roadmap from '../components/Roadmap'
import Donors from '../components/Donors'
import SEO from '../components/SEO'
import { useTranslation } from 'react-i18next'

function Home() {
  const { t } = useTranslation()
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Global BUSAN",
    "alternateName": "글로벌 부산",
    "url": "https://globalbusan.xyz",
    "logo": "https://globalbusan.xyz/logo.png",
    "description": t('home.description'),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Busan",
      "addressCountry": "KR"
    },
    "sameAs": [
      "https://twitter.com/globalbusan",
      "https://facebook.com/globalbusan"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "contact@globalbusan.xyz"
    }
  }

  return (
    <main 
      className='relative min-h-screen w-screen overflow-x-hidden'
      role="main"
      aria-label="Global BUSAN 메인 콘텐츠"
    >
      <SEO
        title={t('home.title') + ' - ' + t('home.subtitle')}
        description={t('home.description')}
        keywords="부산, 글로벌 비즈니스, 블록체인, 투자, 기부, 스타트업, 국제 협력, 벤처 투자, 부산 투자, 글로벌 허브"
        url="https://globalbusan.xyz/"
        structuredData={structuredData}
      />
      <Navbar/>
      <Hero/>
      <Donors/>
      <EquityStructure/>
      <Reports/>
      <Roadmap/>
      <Contact />
      <Footer />
    </main>
  )
}

export default Home
