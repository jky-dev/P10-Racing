import { Button } from '@mui/material'
import { SupabaseClient } from '@supabase/supabase-js'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseContext } from '../../contexts/SupabaseContext'

const signIn = (client: SupabaseClient) => {
  client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })
}

const Login: React.FC = () => {
  const { client, setUser } = useSupabaseContext()
  const navigate = useNavigate()

  return (
    <>
      <div>Login</div>
      <Button variant="contained" onClick={() => signIn(client)}>
        Log in with Google
      </Button>
    </>
  )
}

export default Login
