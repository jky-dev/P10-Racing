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
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import { navItemToPathMap } from '../../helpers/helpers'
import { NavItemProp } from '../../interfaces'
import NestedNavItem from './NestedNavItem'

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const { user, client, setUser } = useSupabaseContext()
  const { mode, toggleColorMode } = useUtilsContext()
  const [navItems, setNavItems] = React.useState<NavItemProp[]>([])
  const navigate = useNavigate()
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const menuOpen = Boolean(menuAnchor)
  const [menuItems, setMenuItems] = React.useState<string[]>([])

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev)
  }

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    nav: NavItemProp
  ) => {
    setMenuItems(nav.menu)
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClick = (menuItemString: string) => {
    setMenuAnchor(null)
    handleNavigation(menuItemString)
    if (drawerOpen) {
      setDrawerOpen(false)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>, item: NavItemProp) => {
    if (item.menu) {
      handleMenuOpen(e, item)
    } else {
      navigate('/' + navItemToPathMap[item.name])
      if (drawerOpen) {
        setDrawerOpen(false)
      }
    }
  }

  const handleNavigation = (navItemString: string) => {
    if (navItemString === 'Logout') {
      client.auth.signOut()
      setUser(null)
      navigate('/')
    } else {
      navigate(`/${navItemToPathMap[navItemString]}`)
    }
  }

  const drawer = (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: 'center' }}
            onClick={() => handleMenuClick('P10 Racing')}
          >
            <ListItemText primary="P10 Racing" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {navItems.map((item) =>
          item.menu ? (
            <NestedNavItem
              item={item}
              handleMenuClick={handleMenuClick}
              key={item.name}
            />
          ) : (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                sx={{ textAlign: 'center' }}
                onClick={(e) => handleClick(e, item)}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          )
        )}
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

  React.useEffect(() => {
    const temp: NavItemProp[] = [
      {
        name: 'F1 Info',
        menu: ['Schedule', 'Qualifying', 'Results', 'Standings'],
      },
    ]
    if (user) {
      const profileMenu = ['Edit Profile']
      if (user.app_metadata.provider === 'email')
        profileMenu.push('Change Password')
      profileMenu.push('Logout')
      temp.push({ name: 'Leagues' }, { name: 'Profile', menu: profileMenu })
    } else {
      temp.push({ name: 'Login' })
    }
    temp.push({ name: 'Help', menu: ['About', 'FAQs', 'Contact Us'] })

    setNavItems(temp)
  }, [user])

  const topbarTextColor = mode === 'light' ? '#262626' : '#FFF'

  return (
    <>
      <AppBar
        component="nav"
        sx={{ background: 'transparent', zIndex: 100 }}
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
          <Button
            onClick={() => handleNavigation('P10 Racing')}
            sx={{
              color: topbarTextColor,
              display: { xs: 'none', sm: 'inline' },
            }}
          >
            P10 Racing
          </Button>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                sx={{ color: topbarTextColor }}
                onClick={(e) => handleClick(e, item)}
              >
                {item.name}
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
        open={drawerOpen}
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
      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        {menuItems.map((item) => (
          <MenuItem onClick={() => handleMenuClick(item)} key={item}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default Navigation
