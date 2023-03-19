import { Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import { InviteCodeDbProps, LeagueDbProps } from '../../interfaces'
import { joinLeague } from '../../services/database'
import Loader from '../loader/Loader'
import styles from './Join.module.scss'

interface InvitedLeagueProps extends InviteCodeDbProps {
  leagues: LeagueDbProps
}

const Join = () => {
  const { inviteCode } = useParams()
  const { client, user } = useSupabaseContext()
  const { sendAlert } = useUtilsContext()
  const [invitedLeague, setInvitedLeague] = React.useState<InvitedLeagueProps>()
  const [loading, setLoading] = React.useState(true)

  const navigate = useNavigate()

  const getLeagueForInvite = async () => {
    const { data } = await client
      .from('invite_codes')
      .select('*, leagues (*)')
      .eq('invite_code', inviteCode)

    if (data.length === 1) {
      setInvitedLeague(data[0] as InvitedLeagueProps)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    if (!inviteCode) {
      navigate('/')
    }

    getLeagueForInvite()
  }, [])

  const handleClick = async () => {
    if (user) {
      try {
        await joinLeague(client, user, inviteCode)
        sendAlert('Successfully joined league!')
        navigate('/leagues')
      } catch (e) {
        sendAlert('Failed to join league', 'error')
      }
    } else {
      navigate('/login')
    }
  }

  if (loading) return <Loader />

  if (!invitedLeague)
    return (
      <Typography variant="body1">
        Invalid code :/ Double check your invite code and try again
      </Typography>
    )

  return (
    <div className={styles.container}>
      <Typography variant="h5">You have been invited to join</Typography>
      <Typography variant="h4">{invitedLeague.leagues.name}!</Typography>
      {!user && (
        <Typography variant="body1">
          You must be signed in to join the league
        </Typography>
      )}
      <div>
        <Button onClick={handleClick} variant="contained">
          {user ? 'Join league' : 'Login'}
        </Button>
      </div>
    </div>
  )
}

export default Join
