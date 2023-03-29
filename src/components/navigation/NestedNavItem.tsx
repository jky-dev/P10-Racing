import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material'
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import React from 'react'

import { NavItemProp } from '../../interfaces'

interface NestedNavItemProps {
  item: NavItemProp
}

const NestedNavItem: React.FC<NestedNavItemProps> = ({ item }) => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => {
    setOpen((prev) => !prev)
  }

  return (
    <>
      <ListItem key={item.name} disablePadding>
        <ListItemButton sx={{ textAlign: 'center' }} onClick={handleOpen}>
          <ListItemText primary={item.name} />
          {open ? (
            <ExpandLess sx={{ position: 'absolute', right: '16px' }} />
          ) : (
            <ExpandMore sx={{ position: 'absolute', right: '16px' }} />
          )}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.menu.map((name) => (
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={name} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  )
}

export default NestedNavItem
