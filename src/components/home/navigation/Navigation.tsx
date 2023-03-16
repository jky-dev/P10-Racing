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
      <Typography variant="h6" sx={{ my: 2 }}>
        P10
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
    Logout: 'logout',
  }

  React.useEffect(() => {
    const temp = ['Home', 'Races']
    if (user) {
      temp.push('Leagues', 'My Profile', 'Logout')

      user.email === 'battlefield200@gmail.com' && temp.push('Admin')
    } else {
      temp.push('Login')
    }

    setNavItems(temp)
  }, [user])

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            P10
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
    </Box>
  )
}

export default Navigation
