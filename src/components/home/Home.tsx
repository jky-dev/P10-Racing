import { Typography } from '@mui/material'
import React from 'react'
import { Link as BrowserLink, Outlet } from 'react-router-dom'
import { useSupabaseContext } from '../../contexts/SupabaseContext'

const Home: React.FC = () => {
  const { user } = useSupabaseContext()

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
            {user?.email === 'battlefield200@gmail.com' && (
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
