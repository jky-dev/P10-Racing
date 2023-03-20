import { Alert, AlertColor, Snackbar } from '@mui/material'
import React, { createContext, ReactNode } from 'react'

const UtilsContext = createContext<UtilsContextProps | null>(null)

UtilsContext.displayName = 'Utils Context'

interface SnackBarStateProps {
  open: boolean
  message: string
  variant: AlertColor
}

const pointsMap = new Map<number, number>()

pointsMap.set(10, 25)

const pointsArray = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

pointsArray.forEach((value, index) => {
  pointsMap.set(10 - index, value)
  pointsMap.set(10 + index, value)
})

pointsMap.set(20, -5)

console.log(pointsMap)

const useContext = () => {
  const [snackBarState, setSnackBarState] = React.useState<SnackBarStateProps>({
    open: false,
    message: '',
    variant: 'success',
  })

  const sendAlert: (message: string, variant?: AlertColor) => void = (
    message: string,
    variant: AlertColor = 'success'
  ) => {
    setSnackBarState((prev) => ({
      ...prev,
      open: true,
      message: message,
      variant: variant,
    }))
  }

  const handleClose = () => {
    setSnackBarState((prev) => ({ ...prev, open: false }))
  }

  const SnackBar = () => (
    <Snackbar
      open={snackBarState.open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={snackBarState.variant}>
        {snackBarState.message}
      </Alert>
    </Snackbar>
  )

  return { SnackBar, sendAlert, pointsMap }
}

interface UtilsContextProps {
  sendAlert: (message: string, variant?: AlertColor) => void
  SnackBar: () => JSX.Element
  pointsMap: Map<number, number>
}

export const useUtilsContext: () => UtilsContextProps = () => {
  const context = React.useContext(UtilsContext)

  if (!context) {
    throw new Error('Utils Context undefined')
  }

  return context
}

interface Props {
  children?: ReactNode
}

export const UtilsProvider = ({ children }: Props) => {
  const value = useContext()

  return <UtilsContext.Provider value={value}>{children}</UtilsContext.Provider>
}
