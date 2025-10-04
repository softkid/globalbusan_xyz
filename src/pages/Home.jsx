import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import EquityStructure from '../components/EquityStructure'
import Reports from '../components/Reports'
import Roadmap from '../components/Roadmap'

function Home() {
  return (
    <main className='relative min-h-screen w-screen overflow-x-hidden'>
      <Navbar/>
      <Hero/>
      <EquityStructure/>
      <Reports/>
      <Roadmap/>
      <Contact />
      <Footer />
    </main>
  )
}

export default Home
