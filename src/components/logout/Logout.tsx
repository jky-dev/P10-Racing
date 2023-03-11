import { getAuth, signOut } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const goodbye = () => {
  const navigate = useNavigate()

  signOut(getAuth()).then(() => {
    navigate('/')
  })
}

const Logout: React.FC = () => {
  return <button onClick={goodbye}>Log out</button>
}

export default Logout
