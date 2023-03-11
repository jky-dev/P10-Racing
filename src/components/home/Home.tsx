import { Typography } from '@mui/material'
import { getAuth } from 'firebase/auth'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link as BrowserLink, Outlet } from 'react-router-dom'

const Home: React.FC = () => {
  const [user] = useAuthState(getAuth())

  return (
    <>
      <Typography variant="h3">P10 Racing League</Typography>
      <div>
        <nav>
          <ul>
            <li>
              <BrowserLink to="/">Home</BrowserLink>
            </li>
            <li>
              <BrowserLink to="/races">Races</BrowserLink>
            </li>
            {user && (
              <>
                <li>
                  <BrowserLink to="/leagues">Leagues</BrowserLink>
                </li>
                <li>
                  <BrowserLink to="/profile">My Profile</BrowserLink>
                </li>
              </>
            )}
            {user?.uid === '4bxsPkapBEYiuZO07ix9vVh1eJZ2' && (
              <li>
                <BrowserLink to="/admin">Admin</BrowserLink>
              </li>
            )}
            {user ? (
              <li>
                <BrowserLink to="/logout">Logout</BrowserLink>
              </li>
            ) : (
              <li>
                <BrowserLink to="/login">Login</BrowserLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <Outlet />
    </>
  )
}

export default Home
