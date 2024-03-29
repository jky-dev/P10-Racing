import { Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import { InvitedLeagueRpcProps } from '../../interfaces'
import { joinLeague } from '../../services/database'
import Loader from '../loader/Loader'
import styles from './Join.module.scss'

const Join = () => {
  const { inviteCode } = useParams()
  const { client, user } = useSupabaseContext()
  const { sendAlert } = useUtilsContext()
  const [invitedLeague, setInvitedLeague] =
    React.useState<InvitedLeagueRpcProps>()
  const [loading, setLoading] = React.useState(true)

  const navigate = useNavigate()

  const getLeagueForInvite = async () => {
    const { data } = await client.rpc('get_league_for_invite_code', {
      invite: inviteCode,
    })

    if (data.length === 1) {
      setInvitedLeague(data[0] as InvitedLeagueRpcProps)
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
      localStorage.setItem(
        'inviteToken',
        JSON.stringify({
          code: inviteCode,
          time: new Date().valueOf() + 1800000, // new invite code lasts 30 mins for auto redirect
        })
      )
      client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/join/' + inviteCode,
        },
      })
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
    <div className={`${styles.container} fadeIn`}>
      <Typography variant="h4">You have been invited to join</Typography>
      <Typography variant="h5" sx={{ mt: 6, mb: 6 }}>
        {invitedLeague.name}!
      </Typography>
      {!user && (
        <Typography variant="body1">
          You must be signed in to join the league.
        </Typography>
      )}
      <div>
        <Button onClick={handleClick} variant="contained">
          {user ? 'Join league' : 'Sign in with Google'}
        </Button>
      </div>
    </div>
  )
}

export default Join
