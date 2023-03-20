import { Theme } from '@emotion/react'
import {
  Alert,
  AlertColor,
  PaletteMode,
  Snackbar,
  createTheme,
} from '@mui/material'
import React, { ReactNode, createContext } from 'react'

const UtilsContext = createContext<UtilsContextProps | null>(null)

UtilsContext.displayName = 'Utils Context'

interface SnackBarStateProps {
  open: boolean
  message: string
  variant: AlertColor
}

const pointsMap = new Map<number, number>()
const pointsArray = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
pointsArray.forEach((value, index) => {
  pointsMap.set(10 - index, value)
  pointsMap.set(10 + index, value)
})
pointsMap.set(20, -5)

const useContext = () => {
  const [snackBarState, setSnackBarState] = React.useState<SnackBarStateProps>({
    open: false,
    message: '',
    variant: 'success',
  })
  const [mode, setMode] = React.useState<PaletteMode>(
    (localStorage.getItem('theme') as PaletteMode) || 'light'
  )

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

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode]
  )

  const toggleColorMode = () => {
    localStorage.setItem('theme', mode === 'light' ? 'dark' : 'light')
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
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

  return { SnackBar, sendAlert, pointsMap, theme, toggleColorMode, mode }
}

interface UtilsContextProps {
  sendAlert: (message: string, variant?: AlertColor) => void
  SnackBar: () => JSX.Element
  pointsMap: Map<number, number>
  theme: Theme
  toggleColorMode: () => void
  mode: PaletteMode
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
