import { Typography } from '@mui/material'
import React from 'react'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { UserDbProps } from '../../interfaces'
import Loader from '../loader/Loader'

const Profile = () => {
  const { user, client } = useSupabaseContext()
  const [profile, setProfile] = React.useState<UserDbProps | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)

  const fetchProfile = async () => {
    const { data }: { data: UserDbProps[] } = await client
      .from('users')
      .select('*')
      .eq('uuid', user.id)

    setProfile(data[0])
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
        <>
          <Typography variant="h4">Coming soon</Typography>
          <Typography variant="h5">Email: {profile?.email}</Typography>
          
          <Typography variant="h5">Name: {profile?.name}</Typography>
        </>
      )}
    </>
  )
}

export default Profile
