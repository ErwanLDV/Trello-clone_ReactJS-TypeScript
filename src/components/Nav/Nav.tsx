import React, { useEffect, useState } from 'react'
import Logo from '../../assests/Logo_Trello.svg'

export default function Nav() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 810); 

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 810);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <nav>
      {!isMobile ?
        <>
          <img className='LogoTrello' src={Logo} alt='Logo trello' />

          <a href="#">Home</a>
          <a href="#">Workspace</a>
          <a href="#">Contact</a>
        </>
        : <>
          <img className='LogoTrello' src={Logo} alt='Logo trello' />

          <div className='burger-icon'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </>}
    </nav>
  )
}
