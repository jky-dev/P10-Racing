import { EmojiEvents } from '@mui/icons-material'
import {
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'
import React from 'react'

import { LeagueMembersDbProps, LeagueResultsDbProps } from '../../../interfaces'

interface LeaderboardProps {
  leagueResultsMap: Map<string, Map<number, LeagueResultsDbProps>>
  usersMap: Map<string, LeagueMembersDbProps>
}

interface LeaderboardArrayProp {
  user: string
  total: number
  p10Total: number
  dnfTotal: number
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  leagueResultsMap,
  usersMap,
}) => {
  const [leaderboardArray, setLeaderboardArray] = React.useState<
    LeaderboardArrayProp[]
  >([])

  const init = () => {
    const tempArray: LeaderboardArrayProp[] = []
    for (const [id, raceMap] of Array.from(leagueResultsMap.entries())) {
      let p10Total = 0
      let dnfTotal = 0
      for (const race of Array.from(raceMap.values())) {
        p10Total += race.points_gained
        dnfTotal += race.dnf_points_gained
      }
      const total = dnfTotal + p10Total
      const obj = {
        user: usersMap.get(id).users.name,
        total: total,
        dnfTotal: dnfTotal,
        p10Total: p10Total,
      }
      tempArray.push(obj)
    }
    tempArray.sort((a, b) => b.total - a.total)
    setLeaderboardArray([...tempArray])
  }

  React.useEffect(() => {
    init()
  }, [])

  const colorMap: { [index: number]: string } = {
    0: '#FFD700',
    1: '#C0C0C0',
    2: '#CD7F32',
  }

  return (
    <>
      <Typography variant="h4">Leaderboard</Typography>
      <Card elevation={2} sx={{ pt: 0, pl: 2 }}>
        <List sx={{ pt: 0, pb: 0 }}>
          {leaderboardArray.map((obj, index) => (
            <ListItem disableGutters key={obj.user}>
              {index < 3 && (
                <ListItemAvatar>
                  <EmojiEvents htmlColor={colorMap[index]} />
                </ListItemAvatar>
              )}
              <ListItemText
                primary={obj.user}
                secondary={`${obj.total} | P10 - ${obj.p10Total} | DNF - ${obj.dnfTotal}`}
                inset={index > 2}
                sx={{ width: 500 }}
              />
            </ListItem>
          ))}
        </List>
      </Card>
    </>
  )
}

export default Leaderboard
