import { Button } from '@mui/material'
import React from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

const signIn = (navigate: NavigateFunction) => {
  navigate('/')
}

const Login: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <div>Login</div>
      <Button variant="contained" onClick={() => signIn(navigate)}>
        Log in with Google
      </Button>
    </>
  )
}

export default Login
