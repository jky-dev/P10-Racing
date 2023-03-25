import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import React from 'react'

interface DeleteDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  name: string
  handleDelete: () => void
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  setOpen,
  name,
  handleDelete,
}) => {
  const handleClose = () => {
    setOpen(false)
  }

  const deleteOnClickHandler = () => {
    handleDelete()
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Delete ${name}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {name}? This action CANNOT be undone!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={deleteOnClickHandler}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
