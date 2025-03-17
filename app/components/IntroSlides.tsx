import React from 'react';
import Logo from './Logo';

function WelcomeCarousel() {
  return (
    <div className='p-10'>
      <div className='flex justify-start'>
        <Logo />
      </div>
      <div>
        <p className='text-zinc-400 font-semibold'>Interactive Learning for kids</p>
      </div>
    </div>
  );
}

export default WelcomeCarousel;