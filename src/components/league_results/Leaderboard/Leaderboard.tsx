import {
  ArrowDropDown,
  ArrowDropUp,
  EmojiEvents,
  Remove,
} from '@mui/icons-material'
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
import { useInView } from 'react-intersection-observer'

import { useUtilsContext } from '../../../contexts/UtilsContext'
import { LeagueMembersDbProps, LeagueResultsDbProps } from '../../../interfaces'
import styles from './Leaderboard.module.scss'

interface LeaderboardProps {
  leagueResultsMap: Map<string, Map<number, LeagueResultsDbProps>>
  usersMap: Map<string, LeagueMembersDbProps>
}

interface LeaderboardArrayProp {
  user: string
  userId: string
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
  const [relativeRankings, setRelativeRankings] = React.useState<Map<
    string,
    number
  > | null>(null)
  const { mode } = useUtilsContext()

  const { ref, inView, entry } = useInView()

  const init = () => {
    const tempArray: LeaderboardArrayProp[] = []
    const tempArrayPreviousWeek: LeaderboardArrayProp[] = []
    for (const [id, raceMap] of Array.from(leagueResultsMap.entries())) {
      let p10Total = 0
      let dnfTotal = 0
      const raceMapArray = Array.from(raceMap.values())
        .filter((race) => race.points_gained !== null)
        .sort((a, b) => a.races.round_number - b.races.round_number)

      for (let i = 0; i < raceMapArray.length - 1; i++) {
        p10Total += raceMapArray[i].points_gained
        dnfTotal += raceMapArray[i].dnf_points_gained
      }

      const totalPreviousWeek = p10Total + dnfTotal
      const prevWeekObj = {
        user: usersMap.get(id).users.name,
        userId: id,
        total: totalPreviousWeek,
        dnfTotal: dnfTotal,
        p10Total: p10Total,
      }

      if (raceMapArray.length > 0) {
        p10Total += raceMapArray[raceMapArray.length - 1].points_gained
        dnfTotal += raceMapArray[raceMapArray.length - 1].dnf_points_gained
      }

      const total = dnfTotal + p10Total
      const obj = {
        user: usersMap.get(id).users.name,
        userId: id,
        total: total,
        dnfTotal: dnfTotal,
        p10Total: p10Total,
      }

      tempArrayPreviousWeek.push(prevWeekObj)
      tempArray.push(obj)
    }
    const previousWeekRankingArray = tempArrayPreviousWeek
      .sort((a, b) => b.total - a.total)
      .map((e) => e.userId)
    tempArray.sort((a, b) => b.total - a.total)
    const rrMap = new Map<string, number>()
    for (let i = 0; i < tempArray.length; i++) {
      const user = tempArray[i]
      const positionsGained = previousWeekRankingArray.indexOf(user.userId) - i
      rrMap.set(user.userId, positionsGained)
    }
    setRelativeRankings(rrMap)
    setLeaderboardArray([...tempArray])
  }

  React.useEffect(() => {
    init()
  }, [])

  React.useEffect(() => {
    inView &&
      Array.from(entry.target.children).forEach((e) =>
        e.classList.add('fadeInListDelay')
      )
  }, [inView, mode])

  const colorMap: { [index: number]: string } = {
    0: '#FFD700',
    1: '#C0C0C0',
    2: '#CD7F32',
  }

  return (
    <>
      <Typography variant="h4" className="fadeIn">
        Leaderboard
      </Typography>
      <Card elevation={2} sx={{ pt: 0, pl: 2 }} className="fadeIn">
        <List sx={{ pt: 0, pb: 0, pr: 2 }} ref={ref}>
          {leaderboardArray.map((obj, index) => (
            <ListItem
              key={obj.user}
              sx={{ opacity: 0 }}
              secondaryAction={
                relativeRankings.get(obj.userId) > 0 ? (
                  <span className={styles.icons}>
                    <ArrowDropUp htmlColor="green" />
                    <span>{`(${relativeRankings.get(obj.userId)})`}</span>
                  </span>
                ) : relativeRankings.get(obj.userId) < 0 ? (
                  <span className={styles.icons}>
                    <ArrowDropDown htmlColor="red" />{' '}
                    <span>{`(${relativeRankings.get(obj.userId)})`}</span>
                  </span>
                ) : (
                  <span className={styles.icons}>
                    <Remove htmlColor="gray" />{' '}
                    <span>{`(${relativeRankings.get(obj.userId)})`}</span>
                  </span>
                )
              }
            >
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
