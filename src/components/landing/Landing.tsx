import { Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import styles from './Landing.module.scss'

const Landing: React.FC = () => {
  const { user, client } = useSupabaseContext()
  const [numberUsers, setNumberUsers] = React.useState(null)
  const [numberLeagues, setNumberLeagues] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  const navigate = useNavigate()

  const handleClick = () => {
    if (user) {
      navigate('/leagues')
    } else {
      navigate('/login')
    }
  }

  const init = async () => {
    let { data: users } = await client.rpc('get_number_of_users')
    let { data: leagues } = await client.rpc('get_number_of_leagues')
    setNumberLeagues(leagues)
    setNumberUsers(users)
    setLoading(false)
  }

  React.useEffect(() => {
    init()
  }, [])

  return (
    <span className={styles.container}>
      <div className={styles.heading}>
        <Typography
          variant="h1"
          textAlign="center"
          className={styles.title}
          sx={{}}
        >
          P10 Racing
        </Typography>
        <Typography
          component="span"
          variant="h6"
          textAlign="center"
          className={styles.subtitle}
        >
          The ultimate F1 fantasy league!
        </Typography>
      </div>
      <div className={styles.button}>
        <Button variant="outlined" onClick={handleClick}>
          {user ? 'Join a league' : 'Get started'}
        </Button>
      </div>
      {!loading && (
        <Typography
          variant="caption"
          textAlign="center"
          className={styles.stats}
        >
          Join {numberUsers} users competing in {numberLeagues} different
          leagues!
        </Typography>
      )}
    </span>
  )
}
export default Landing
