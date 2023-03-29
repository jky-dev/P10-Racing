import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import React from 'react'

import { NavItemProp } from '../../interfaces'

interface NestedNavItemProps {
  item: NavItemProp
  handleMenuClick: (item: string) => void
  key: string
}

const NestedNavItem: React.FC<NestedNavItemProps> = ({
  item,
  handleMenuClick,
}) => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => {
    setOpen((prev) => !prev)
  }

  return (
    <>
      <ListItem disablePadding>
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
            <ListItemButton
              sx={{ textAlign: 'center' }}
              onClick={() => handleMenuClick(name)}
              key={name}
            >
              <ListItemText primary={name} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  )
}

export default NestedNavItem
