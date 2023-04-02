import { Theme } from '@emotion/react'
import {
  Alert,
  AlertColor,
  PaletteMode,
  Snackbar,
  createTheme,
  responsiveFontSizes,
} from '@mui/material'
import React, { ReactNode, createContext } from 'react'

const UtilsContext = createContext<UtilsContextProps | null>(null)

UtilsContext.displayName = 'Utils Context'

interface SnackBarStateProps {
  open: boolean
  message: string
  variant: AlertColor
  timeout: number | null
}

const useContext = () => {
  const [snackBarState, setSnackBarState] = React.useState<SnackBarStateProps>({
    open: false,
    message: '',
    variant: 'success',
    timeout: 6000,
  })
  const [mode, setMode] = React.useState<PaletteMode>(
    (localStorage.getItem('theme') as PaletteMode) || 'light'
  )
  const [threeJsHome, setThreeJsHome] = React.useState<boolean>(
    localStorage.getItem('3dHome') === 'true' || false
  )

  const handleThreeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('3dHome', e.target.checked.toString())
    setThreeJsHome(e.target.checked)
  }

  const sendAlert: (
    message: string,
    variant?: AlertColor,
    timeout?: number
  ) => void = (
    message: string,
    variant: AlertColor = 'success',
    timeout = 6000
  ) => {
    setSnackBarState((prev) => ({
      ...prev,
      open: true,
      message: message,
      variant: variant,
      timeout: timeout,
    }))
  }

  const handleClose = () => {
    setSnackBarState((prev) => ({ ...prev, open: false }))
  }

  const theme = React.useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          components: {
            MuiTableCell: {
              styleOverrides: {
                body: {
                  borderBottom: 'none',
                },
              },
            },
            MuiMenu: {
              styleOverrides: {
                paper: {
                  background: 'transparent',
                  backdropFilter: 'blur(100px)',
                },
              },
            },
            MuiCard: {
              styleOverrides: {
                root: {
                  background: 'transparent',
                },
              },
            },
            MuiAccordion: {
              styleOverrides: {
                root: {
                  background: 'transparent',
                },
              },
            },
            MuiCssBaseline: {
              styleOverrides: {
                body: {
                  backgroundImage:
                    mode === 'light'
                      ? `linear-gradient(141deg, #f2f2f2, #6dc9ff)`
                      : `linear-gradient(141deg, #433c3c, #024d79)`,
                },
              },
            },
          },
          typography: {
            h6: {
              fontWeight: 400,
            },
          },
          palette: {
            mode: mode,
          },
        })
      ),
    [mode]
  )

  const toggleColorMode = () => {
    localStorage.setItem('theme', mode === 'light' ? 'dark' : 'light')
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const SnackBar = () => (
    <Snackbar
      open={snackBarState.open}
      autoHideDuration={snackBarState.timeout}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={snackBarState.variant}>
        {snackBarState.message}
      </Alert>
    </Snackbar>
  )

  return {
    SnackBar,
    sendAlert,
    theme,
    toggleColorMode,
    mode,
    handleThreeToggle,
    threeJsHome,
  }
}

interface UtilsContextProps {
  sendAlert: (
    message: string,
    variant?: AlertColor,
    timeout?: number | null
  ) => void
  SnackBar: () => JSX.Element
  theme: Theme
  toggleColorMode: () => void
  mode: PaletteMode
  handleThreeToggle: (e: React.ChangeEvent<HTMLInputElement>) => void
  threeJsHome: boolean
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
