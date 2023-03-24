import { Brightness4, Brightness7 } from '@mui/icons-material'
import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import React from 'react'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import { UserDbProps } from '../../interfaces'
import Loader from '../loader/Loader'
import styles from './Profile.module.scss'

const Profile = () => {
  const { user, client } = useSupabaseContext()
  const [profile, setProfile] = React.useState<UserDbProps | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [name, setName] = React.useState('')
  const { sendAlert, toggleColorMode, mode } = useUtilsContext()

  const fetchProfile = async () => {
    setLoading(true)
    const { data } = await client.from('users').select('*').eq('uuid', user!.id)

    const profile = (data as UserDbProps[])[0]

    setProfile(profile)
    setName(profile.name)
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (name.trim() === profile.name) {
      sendAlert('Name is already ' + name, 'error')
      return
    }

    if (name.trim() === '') {
      sendAlert('Please enter a name', 'error')
      return
    }

    const { error } = await client
      .from('users')
      .update({ uuid: user.id, name: name.trim() })
      .eq('uuid', user.id)

    if (!error) {
      sendAlert('Name updated to ' + name)
    } else {
      sendAlert('An error occurred while updating name', 'error')
    }

    fetchProfile()
  }

  React.useEffect(() => {
    fetchProfile()
  }, [user])

  return (
    <Box
      sx={{
        width: '100%',
        justifyContent: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
      className="fadeIn"
    >
      <Typography variant="h4" sx={{ mb: 1 }}>
        My Profile
      </Typography>
      {loading || profile === null ? (
        <Loader />
      ) : (
        <>
          <Typography variant="body1">Email: {profile?.email}</Typography>
          <div className={styles.nameContainer}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span>
              <Button onClick={handleSubmit} variant="contained">
                Change
              </Button>
            </span>
          </div>
          <div className={styles.themeToggleContainer}>
            <Typography>
              {mode === 'light' ? 'Light mode' : 'Dark mode'}
            </Typography>
            <IconButton onClick={toggleColorMode}>
              {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </div>
        </>
      )}
    </Box>
  )
}

export default Profile
