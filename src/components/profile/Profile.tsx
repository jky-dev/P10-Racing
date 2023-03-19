import { Box, Typography } from '@mui/material'
import React from 'react'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { UserDbProps } from '../../interfaces'
import Loader from '../loader/Loader'

const Profile = () => {
  const { user, client } = useSupabaseContext()
  const [profile, setProfile] = React.useState<UserDbProps | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)

  const fetchProfile = async () => {
    const { data } = await client.from('users').select('*').eq('uuid', user!.id)

    setProfile((data as UserDbProps[])[0])
    setLoading(false)
  }

  React.useEffect(() => {
    setLoading(true)
    fetchProfile()
  }, [user])

  return (
    <>
      {loading || profile === null ? (
        <Loader />
      ) : (
        <Box
          sx={{
            width: '100%',
            justifyContent: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            My Profile
          </Typography>
          <Typography variant="h5">Email: {profile?.email}</Typography>
          <Typography variant="h5">Name: {profile?.name}</Typography>
        </Box>
      )}
    </>
  )
}

export default Profile
