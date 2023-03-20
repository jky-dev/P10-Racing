import { EmojiEvents } from '@mui/icons-material'
import {
  Avatar,
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
      let total = 0
      for (const race of Array.from(raceMap.values())) {
        total += race.points_gained
      }
      const obj = { user: usersMap.get(id).users.name, total: total }
      tempArray.push(obj)
    }
    tempArray.sort((a, b) => b.total - a.total)
    setLeaderboardArray([...tempArray])

    console.log(tempArray)
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
      <List>
        {leaderboardArray.map((obj, index) => (
          <ListItem disableGutters key={obj.user}>
            {index < 3 && (
              <ListItemAvatar>
                <EmojiEvents htmlColor={colorMap[index]} />
              </ListItemAvatar>
            )}
            <ListItemText
              primary={obj.user}
              secondary={obj.total}
              inset={index > 2}
              sx={{ width: 500 }}
            />
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Leaderboard
