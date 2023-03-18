import { Button } from '@mui/material'
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

  return (
    <Button onClick={() => goodbye()} variant="contained">
      Log out
    </Button>
  )
}

export default Logout
