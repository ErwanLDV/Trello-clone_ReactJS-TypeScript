import React from 'react'
import Logo from '../../assests/Logo_Trello.svg'

export default function Nav() {
  return (
    <nav>
      <img className='LogoTrello' src={Logo} alt='Logo trello' />
      <a href="#">Home</a>
      <a href="#">Workspace</a>
      <a href="#">Contact</a>
    </nav>
  )
}
