import { getAuth, signOut } from 'firebase/auth'
import React from 'react'

const goodbye = () => {
  signOut(getAuth())
}

const Logout: React.FC = () => {
  return <button onClick={goodbye}>Log out</button>
}

export default Logout
