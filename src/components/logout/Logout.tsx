import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logout: React.FC = () => {
  const navigate = useNavigate()

  const goodbye = () => {}

  return <button onClick={() => goodbye()}>Log out</button>
}

export default Logout
