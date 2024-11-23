import React, { useRef, useState } from 'react'

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hadClicked, setHasClicked] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [loadedVideos, setLoadedvideos] = useState(0);
    
    const totatVideo = 4;
    const nextVideoRef = useRef(null);

    const getVideoSrc = (index) => `awwwards_public/public/videos/hero-${index}.mp4`

     const handleMiniVdClick = () => {
        setHasClicked(true);
        setCurrentIndex(prevIndex => prevIndex + 1);
     }

     const handleVideoLoad = () => {
        setLoadedvideos((prev)=> prev + 1)
     }


  return (
    <div className='relative h-dvh w-screen overflow-x-hidden'>
        <div id="video-frame" className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
            <div>
                <div className='mask-clip-path absolute-center z-50 cursor-pointer rounded-lg overflow-hidden size-64'>
                    <div onClick={handleMiniVdClick} className='origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100 cursor-pointer'>
                        <video
                            ref={nextVideoRef}
                            src={getVideoSrc(currentIndex + 1)}
                            loop
                            muted
                            id="current-video"
                            className="size-64 origin-center scale-150 object-cover object-center"
                            onLoadedData={handleVideoLoad}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero