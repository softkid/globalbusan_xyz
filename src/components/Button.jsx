import React from 'react'

const Button = ({title, containerClass, leftIcon, rightIcon, id}) => {
  return (
    <button id={id} className={`group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black ${containerClass}`}>
        {leftIcon}
        <span className='relative inline-flex overflow-hidden uppercase font-general text-xs'>
            <div>
                {title}
            </div>
        </span>
    </button>
  )
}

export default Button