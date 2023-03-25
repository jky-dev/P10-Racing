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

const Navigation = () => {
  const [open, setOpen] = React.useState(false)
  const { user } = useSupabaseContext()
  const [navItems, setNavItems] = React.useState<string[]>([])
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', mb: 3 }}>
      <Typography variant="body1" sx={{ my: 2 }}>
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
      </List>
    </Box>
  )

  const navMap: { [key: string]: string } = {
    Home: '',
    Races: 'races',
    Leagues: 'leagues',
    'My Profile': 'profile',
    Admin: 'admin',
    Login: 'login',
    About: 'about',
  }

  React.useEffect(() => {
    const temp = ['Home', 'Races']
    if (user) {
      temp.push('Leagues', 'My Profile')

      user.email === 'battlefield200@gmail.com' && temp.push('Admin')
    } else {
      temp.push('Login')
    }
    temp.push('About')

    setNavItems(temp)
  }, [user])

  return (
    <>
      <AppBar component="nav">
        <Toolbar sx={{ flexDirection: { xs: 'row-reverse', sm: 'row' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ ml: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="body1"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            P10 Racing
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{ color: '#fff' }}
                onClick={() => navigate('/' + navMap[item])}
              >
                {item}
              </Button>
            ))}
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
