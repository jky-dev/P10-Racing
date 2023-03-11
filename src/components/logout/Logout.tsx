import { getAuth, signOut } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logout: React.FC = () => {
  const navigate = useNavigate()

  const goodbye = () => {
    signOut(getAuth()).then(() => {
      navigate('/')
    })
  }

  return <button onClick={() => goodbye()}>Log out</button>
}

export default Logout
