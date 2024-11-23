import React, { useState } from 'react'

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hadClicked, setHasClicked] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [loadedVideos, setLoadedvideos] = useState(0);
    
    const totatVideo = 4;
    const nextVdRef = useRef(null);

     const handleMiniVdClick = () => {

     }
  return (
    <div className='relative h-dvh w-screen overflow-x-hidden'>
        <div id="video-frame" className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
            <div>
                <div className='mask-clip-path absolute-center z-50 cursor-pointer rounded-lg overflow-hidden size-64'>
                    <div>
                        MiniVideoPlayer
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero