import { Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import { LeagueDbProps, LeagueMembersDbProps } from '../../interfaces'
import { createLeague, joinLeague } from '../../services/database'
import LeagueResults from '../league_results/LeagueResults'
import Loader from '../loader/Loader'
import styles from './Leagues.module.scss'

interface JoinedLeagueProps extends LeagueMembersDbProps {
  leagues: LeagueDbProps
}

const Leagues: React.FC = () => {
  const [leagueName, setLeagueName] = React.useState('')
  const [leagueCode, setLeagueCode] = React.useState('')
  const [leagueId, setLeagueId] = React.useState<number>(-1)
  const { client, user } = useSupabaseContext()
  const [loading, setLoading] = React.useState(false)
  const [joinedLeagues, setJoinedLeagues] = React.useState<JoinedLeagueProps[]>(
    []
  )
  const { sendAlert } = useUtilsContext()

  const onCreateHandler = async () => {
    // add the league to your user profile
    // create league, access code and add user to it
    // create access code -> league mapping
    if (leagueName.length === 0) return
    setLoading(true)
    try {
      await createLeague(
        client,
        user,
        leagueName,
        crypto.randomUUID().slice(0, 6)
      )
      sendAlert('Successfully created league ' + leagueName)
    } catch (exception) {
      sendAlert('Failed to create league, please try again later', 'error')
    }
    setLoading(false)
    fetchLeagues()
  }

  const onJoinHandler = async () => {
    // add user to the league
    // add league to the user
    if (leagueCode.length === 0) return
    setLoading(true)
    try {
      await joinLeague(client, user!, leagueCode)
    } catch (e) {
      sendAlert(e.message, 'error')
    }
    setLoading(false)
    fetchLeagues()
  }

  const fetchLeagues = async () => {
    setLoading(true)
    // fetch leagues that you belong to
    const { data } = await client
      .from('league_members')
      .select(
        `
          league_id, leagues (name)
        `
      )
      .eq('user_uuid', user!.id)

    setJoinedLeagues(data as JoinedLeagueProps[])
    setLoading(false)
  }

  React.useEffect(() => {
    if (user === null) return
    fetchLeagues()
  }, [user])

  if (loading) return <Loader />

  return (
    <div className={styles.container}>
      <Typography variant="h4">My Leagues</Typography>
      <div className={styles.leaguesContainer}>
        {joinedLeagues.map((league) => {
          return (
            <span key={league.league_id}>
              <Button
                onClick={() => setLeagueId(league.league_id)}
                variant="outlined"
              >
                {league.leagues.name}
              </Button>
            </span>
          )
        })}
      </div>
      <LeagueResults leagueId={leagueId} />
      <div className={styles.leagueSubmitContainer}>
        <TextField
          helperText="Enter your league name"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
        >
          League name
        </TextField>
        <span>
          <Button variant="contained" onClick={onCreateHandler}>
            Create a league
          </Button>
        </span>
      </div>
      <div className={styles.leagueSubmitContainer}>
        <TextField
          helperText="Enter your league code here"
          value={leagueCode}
          onChange={(e) => setLeagueCode(e.target.value)}
        >
          League code
        </TextField>
        <span>
          <Button variant="contained" onClick={onJoinHandler}>
            Join a league
          </Button>
        </span>
      </div>
    </div>
  )
}

export default Leagues
