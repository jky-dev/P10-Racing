import { Error } from '@mui/icons-material'
import { Button, Divider, Link, TextField, Typography } from '@mui/material'
import { SupabaseClient } from '@supabase/supabase-js'
import { isValid } from 'date-fns'
import React from 'react'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import Loader from '../loader/Loader'
import styles from './Login.module.scss'
import SignupSuccess from './signupSuccess/SignupSuccess'

const signIn = (client: SupabaseClient) => {
  client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })
}

const Login: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [signUpPassword, setSignUpPassword] = React.useState('')
  const [loginState, setLoginState] = React.useState<'login' | 'signup'>(
    'login'
  )
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<string | null>(null)
  const { client } = useSupabaseContext()
  const { sendAlert } = useUtilsContext()

  const toggleState = () => {
    setLoginState((prev) => (prev === 'login' ? 'signup' : 'login'))
    setEmail('')
    setPassword('')
    setSignUpPassword('')
    setError('')
  }

  const isValidEmail = () => {
    return !!email.match('^[^@]+@[^@]+.[^@]+$')
  }

  const validFields = (): boolean => {
    if (!isValidEmail()) {
      setError('Please enter a valid email')
      return false
    }

    if (loginState === 'signup' && password !== signUpPassword) {
      setError('Passwords do not match')
      return false
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    return true
  }

  const handleLogin = async () => {
    if (!validFields()) return

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })
    console.log('data:', data, 'error:', error)
    if (error) {
      setError(error.message)
    } else {
      // handle login
      if (data.user) {
        // check verification email
      }
    }
  }

  const handleSignUp = async () => {
    if (!validFields()) return

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://p10racing.app/login',
      },
    })
    console.log('data:', data, 'error:', error)

    if (error) {
      setError(error.message)
    } else {
      toggleState()
      sendAlert(
        'Successfully signed up! Please verify your email before logging in',
        'success',
        null
      )
    }
  }

  const handleSubmit = async () => {
    setError(null)
    setLoading(
      loginState === 'login' ? 'Logging you in...' : 'Signing you up...'
    )
    if (loginState === 'login') {
      await handleLogin()
    } else {
      await handleSignUp()
    }
    setLoading(null)
  }

  const forgotPasswordHandler = async () => {
    if (!isValidEmail()) {
      sendAlert('Please enter a valid email', 'error')
      return
    }
    setLoading('Sending forgot password email...')
    const { data, error } = await client.auth.resetPasswordForEmail(email)
    setLoading(null)
    console.log(data, error)
    if (error) {
      if (
        error.message.includes(
          'AuthApiError: For security purposes, you can only request this once every 60 seconds'
        )
      ) {
        sendAlert('Please try again after 60 seconds', 'error')
      } else {
        sendAlert(
          'An unknown error occurred while sending forgot password email',
          'error'
        )
      }
    } else {
      sendAlert(`An email has been sent to ${email}`)
    }
  }

  return (
    <div className={`${styles.container} fadeIn`}>
      <Typography variant="h4" width="100%" sx={{ userSelect: 'none' }}>
        Login
      </Typography>
      <Button variant="contained" onClick={() => signIn(client)}>
        Sign in with Google
      </Button>
      <Divider flexItem />
      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader text={loading} />
        </div>
      ) : (
        <div className={styles.manualContainer}>
          <TextField
            label="Email"
            fullWidth
            autoComplete="email"
            placeholder="Your login email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
          >
            Email
          </TextField>
          <TextField
            label={loginState === 'login' ? 'Password' : 'Choose a password'}
            placeholder="At least 6 characters"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >
            Password
          </TextField>
          {loginState === 'signup' && (
            <TextField
              label="Re-enter your password"
              type="password"
              fullWidth
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            >
              Password
            </TextField>
          )}
          {error && (
            <Typography variant="subtitle1" className={styles.error}>
              <Error color="error" />
              <span>{error}</span>
            </Typography>
          )}
          <Button
            variant="contained"
            className={styles.button}
            onClick={handleSubmit}
          >
            {loginState === 'login' ? 'Login' : 'Signup'}
          </Button>
          <Typography variant="subtitle2" sx={{ userSelect: 'none' }}>
            {loginState === 'login'
              ? 'No account?'
              : 'Already have an account?'}{' '}
            <Link
              onClick={toggleState}
              underline="none"
              className={styles.link}
            >
              {loginState === 'login' ? 'Sign up' : 'Login'}
            </Link>
          </Typography>
          <Link
            underline="none"
            className={styles.link}
            variant="subtitle2"
            onClick={forgotPasswordHandler}
          >
            Forgot your password?
          </Link>
        </div>
      )}
    </div>
  )
}

export default Login
