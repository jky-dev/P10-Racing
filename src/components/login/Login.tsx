import { Button } from '@mui/material'
import { SupabaseClient } from '@supabase/supabase-js'
import React from 'react'

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
  const { client } = useSupabaseContext()

  return (
    <div className="fadeIn">
      <Button variant="contained" onClick={() => signIn(client)}>
        Sign in with Google
      </Button>
    </div>
  )
}

export default Login
