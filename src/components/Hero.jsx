import React, { useRef, useState } from 'react'
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';

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
        setCurrentIndex(upcomingVideoIndex);
     }

     const handleVideoLoad = () => {
        setLoadedvideos((prev)=> prev + 1)
     }

     const upcomingVideoIndex = (currentIndex % totatVideo) + 1;


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
                <video
                    ref={nextVideoRef}
                    src={getVideoSrc(currentIndex)}
                    loop
                    muted
                    id='next-video'
                    className='absolute-center z-20 object-cover object-center size-64 invisible absolute'

                />
                <video
                    src={getVideoSrc(currentIndex === totatVideo - 1? 1 : currentIndex)}
                    autoPlay
                    loop
                    muted
                    className='absolute left-0 top-0 size-full object-cover object-center'
                />
            </div>
            <h1 className='special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75'>
                G<b>a</b>ming
            </h1>
            <div className='absolute left-0 top-0 z-40 size-full'>
                <div className='mt-24 px-5 sm:px-10'>
                    <h1 className='hero-heading special-font text-blue-100'>redefi<b>n</b>e</h1>
                    <p className='mb-5 max-w-64 font-robert-regular text-blue-100'>Enter the Metagame Layer <br/> Unleash the Play Economy</p>
                    <Button id="watch-trailer" title="Watch Trailer" leftIcon={<TiLocationArrow/>} containerClass='!bg-yellow-300 flex-center gap-1'/>
                </div>

            </div>
        </div>
          <h1 className='special-font hero-heading absolute bottom-5 right-5 z-40 text-black'>
                G<b>a</b>ming
            </h1>
    </div>
  )
}

export default Hero