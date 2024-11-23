import { useState } from 'react'
import Hero from './components/Hero'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main className='relaive min-h-screen w-screen overflow-x-hidden'>
        <Hero/>
        <div className='bg-blue-600 h-78 h-screen'>jdjdjd</div>
      </main>
    </>
  )
}

export default App
