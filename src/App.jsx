import { useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Navbar from './components/Navbar'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main className='relaive min-h-screen w-screen overflow-x-hidden'>
        <Navbar/>
        <Hero/>
        <About/>
      </main>
    </>
  )
}

export default App
