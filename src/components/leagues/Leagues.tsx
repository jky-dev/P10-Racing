import { Delete, Share } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import React from 'react'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import {
  InviteCodeDbProps,
  LeagueDbProps,
  LeagueMembersDbProps,
  LeaguesProps,
} from '../../interfaces'
import { createLeague, joinLeague } from '../../services/database'
import LeagueResults from '../league_results/LeagueResults'
import Loader from '../loader/Loader'
import DeleteDialog from './DeleteDialog/DeleteDialog'
import styles from './Leagues.module.scss'

interface JoinedLeagueProps extends LeagueMembersDbProps {
  leagues: LeagueDbProps
  invite_codes: InviteCodeDbProps
}

const Leagues: React.FC = () => {
  const [leagueName, setLeagueName] = React.useState('')
  const [leagueCode, setLeagueCode] = React.useState('')
  const [leagueId, setLeagueId] = React.useState<number>(-1)
  const { client, user } = useSupabaseContext()
  const [loading, setLoading] = React.useState(true)
  const [joinedLeagues, setJoinedLeagues] = React.useState(
    new Map<number, LeagueDbProps>()
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
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
      setLeagueName('')
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
          league_id, leagues (*)
        `
      )
      .eq('user_uuid', user.id)

    const tempLeaguesMap = new Map<number, LeaguesProps>()
    for (const league of data as JoinedLeagueProps[]) {
      tempLeaguesMap.set(league.league_id, league.leagues)
    }

    setJoinedLeagues(tempLeaguesMap)
    setLeagueId(tempLeaguesMap.values().next().value?.id || -1)
    setLoading(false)
  }

  React.useEffect(() => {
    if (user === null) return
    fetchLeagues()
  }, [user])

  const handleInviteClick = async () => {
    await navigator.clipboard.writeText(
      window.location.origin +
        '/join/' +
        joinedLeagues.get(leagueId).invite_code
    )
    sendAlert('Copied invite to clipboard!')
  }

  const handleDelete = async () => {
    await client.rpc('delete_league', { league_id: leagueId })
    fetchLeagues()
  }

  const isOwner = joinedLeagues.get(leagueId)?.created_by_uuid === user.id

  const validLeague = leagueId !== -1

  if (loading) return <Loader />

  return (
    <div className={`${styles.container} fadeIn`}>
      {validLeague ? (
        <>
          <DeleteDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            name={joinedLeagues.get(leagueId).name}
            handleDelete={handleDelete}
          />
          <div className={styles.title}>
            <Typography variant="h4">
              {joinedLeagues.get(leagueId).name}
            </Typography>
            {validLeague && (
              <span>
                <span>
                  <Tooltip title="Copy invite code">
                    <IconButton onClick={handleInviteClick}>
                      <Share color="primary" />
                    </IconButton>
                  </Tooltip>
                </span>
                {isOwner && (
                  <span>
                    <Tooltip title="Delete league">
                      <IconButton onClick={() => setDeleteDialogOpen(true)}>
                        <Delete color="primary" />
                      </IconButton>
                    </Tooltip>
                  </span>
                )}
              </span>
            )}
          </div>
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={leagueId}
              onChange={(e, v) => setLeagueId(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabScrollButton-root': {
                  opacity: '0.8 !important',
                },
              }}
            >
              {Array.from(joinedLeagues.values()).map((league) => {
                return (
                  <Tab label={league.name} value={league.id} key={league.id} />
                )
              })}
            </Tabs>
          </Box>
          <LeagueResults leagueId={leagueId} />
        </>
      ) : (
        <>
          <Typography variant="h4">Leagues</Typography>
          <Typography>Create or join a league to play!</Typography>
        </>
      )}
      <div className={styles.leagueSubmitContainer}>
        <TextField
          helperText="Enter your league name"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
          autoComplete="off"
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
          autoComplete="off"
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
