import { DarkMode, LightMode } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabaseContext } from '../../../contexts/SupabaseContext'
import { useUtilsContext } from '../../../contexts/UtilsContext'

const Navigation = () => {
  const [open, setOpen] = React.useState(false)
  const { user } = useSupabaseContext()
  const { mode, toggleColorMode } = useUtilsContext()
  const [navItems, setNavItems] = React.useState<string[]>([])
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', mb: 3 }}>
      <Typography variant="body1" sx={{ my: 2, userSelect: 'none' }}>
        P10 Racing
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{ textAlign: 'center' }}
              onClick={() => navigate('/' + navMap[item])}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: 'center', justifyContent: 'center' }}
            onClick={toggleColorMode}
          >
            {mode === 'light' ? <LightMode /> : <DarkMode />}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  const navMap: { [key: string]: string } = {
    'P10 Racing': '',
    Races: 'races',
    Leagues: 'leagues',
    'My Profile': 'profile',
    Admin: 'admin',
    Login: 'login',
    About: 'about',
    Quali: 'qualifying',
  }

  React.useEffect(() => {
    const temp = ['Races', 'Quali']
    if (user) {
      temp.push('Leagues', 'My Profile')

      user.email === 'battlefield200@gmail.com' && temp.push('Admin')
    } else {
      temp.push('Login')
    }
    temp.push('About')

    setNavItems(temp)
  }, [user])

  const topbarTextColor = mode === 'light' ? '#262626' : '#FFF'

  return (
    <>
      <AppBar
        component="nav"
        sx={{ background: 'transparent' }}
        elevation={0}
        position="static"
      >
        <Toolbar
          sx={{
            flexDirection: { xs: 'row-reverse', sm: 'row' },
            justifyContent: 'space-between',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{
              ml: 2,
              display: { sm: 'none' },
              color: topbarTextColor,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Button onClick={() => navigate('/')} sx={{ color: topbarTextColor }}>
            P10 Racing
          </Button>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{ color: topbarTextColor }}
                onClick={() => navigate('/' + navMap[item])}
              >
                {item}
              </Button>
            ))}
            <IconButton
              onClick={toggleColorMode}
              sx={{ color: topbarTextColor, flex: 1 }}
            >
              {mode === 'light' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav" />
      <Drawer
        anchor="right"
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Navigation
