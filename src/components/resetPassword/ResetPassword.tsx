import { Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import styles from './ResetPassword.module.scss'

const ResetPassword = () => {
  const { client, user } = useSupabaseContext()
  const navigate = useNavigate()
  const [password, setPassword] = React.useState('')
  const [password2, setPassword2] = React.useState('')
  const [error, setError] = React.useState<string | null>('')
  const { sendAlert } = useUtilsContext()

  const validate = () => {
    if (password !== password2) {
      setError('Passwords do not match')
      return false
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
  }

  const handleSubmit = async () => {
    console.log('submit')
    if (!validate()) return

    setError(null)

    const { data, error } = await client.auth.updateUser({ password })

    console.log(data, error)

    if (error) {
      sendAlert('An error occurred')
    }

    if (data) {
      sendAlert('Successfully reset password')
    }
  }

  React.useEffect(() => {
    if (user.app_metadata.provider !== 'email') navigate('/')
  }, [])

  return (
    <div className={`${styles.container} fadeIn`}>
      <Typography sx={{ userSelect: 'none' }} variant="h4">
        Reset password
      </Typography>
      <TextField
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        label="New password"
      />
      <TextField
        onChange={(e) => setPassword2(e.target.value)}
        value={password2}
        type="password"
        label="Confirm password"
      />
      {error && (
        <Typography variant="subtitle1" className={styles.error}>
          {error}
        </Typography>
      )}
      <span>
        <Button variant="contained" onClick={handleSubmit}>
          Change Password
        </Button>
      </span>
    </div>
  )
}

export default ResetPassword
