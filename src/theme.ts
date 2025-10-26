import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const base = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2d6a4f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#40916c',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2ecc71',
    },
    warning: {
      main: '#f6c23e',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#3b82f6',
    },
    background: {
      default: '#f7f9fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#173f2f',
      secondary: '#4b5b52',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.8rem',
      lineHeight: 1.15,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 24px rgba(15, 23, 24, 0.06)',
          border: '1px solid rgba(16,24,20,0.04)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 600,
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #2d6a4f 0%, #40916c 100%)',
          color: '#fff',
          boxShadow: '0 6px 18px rgba(64,145,108,0.18)',
        },
        outlined: {
          borderWidth: 1,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
})

const theme = responsiveFontSizes(base)

export default theme
