import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseContext } from '../../contexts/SupabaseContext'

const Logout: React.FC = () => {
  const navigate = useNavigate()
  const { client, user, setUser } = useSupabaseContext()

  const goodbye = () => {
    client.auth.signOut()
    setUser(null)
    navigate('/')
  }

  React.useEffect(() => {
    if (!user) navigate('/')
  }, [])

  return <button onClick={() => goodbye()}>Log out</button>
}

export default Logout
