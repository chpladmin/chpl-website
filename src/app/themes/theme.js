import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  root: {
    width: '100%',
    display: 'flex',
    '& > * + *': {
      marginBottom: '',
    },
  },
  spacing: 4,
  palette: {
    background: {
      default: '#000000',
    },
    primary: {
      light: '#599bde',
      main: '#156dac',
      dark: '#00437c',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#8f1c3b',
      main: '#c44f65',
      dark: '#8f1c3b',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
    },
  },
  typography: {
    fontFamily: 'Lato, sans-serif',
    //fontSize: '14px', // the default in material-ui is 14px, and this value is required to be a number
    h1: {
      fontSize: '3.5em',
      fontWeight: 800,
    },
    h2: {
      fontSize: '3em',
      fontWeight: 400,
    },
    h3: {
      fontSize: '2.5em',
      fontWeight: 800,
    },
    h4: {
      fontSize: '2em',
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.5em',
      fontWeight: 800,
    },
    h6: {
      fontSize: '1.25em',
      fontWeight: 400,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        margin: '4px',
      },
    },
  },
});

export default theme;
