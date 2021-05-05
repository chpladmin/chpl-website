import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  root: {
    width: '100%',
    display: 'flex',
  },
  spacing: 4,

  palette: {
    background: {
      default: '#f9f9f9',
    },
    primary: {
      light: '#599bde',
      main: '#156dac',
      dark: '#00437c',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ffffff',
      main: '#f5f9fd',
      dark: '#c2c6ca',
      contrastText: '#000000',
    },
  },

  typography: {
    fontFamily: 'Lato, sans-serif',
    h1: {
      fontSize: '2.250em',
      fontWeight: 800,
    },
    h2: {
      fontSize: '2em',
      fontWeight: 400,
    },
    h3: {
      fontSize: '1.750em',
      fontWeight: 800,
    },
    h4: {
      fontSize: '1.5em',
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.25em',
      fontWeight: 800,
    },
    h6: {
      fontSize: '1.125em',
      fontWeight: 400,
    },
    body1: {
      fontSize: '1em',
    },
    body2: {
      fontSize: '0.875em',
    },
    subtitle1: {
      fontWeight: 800,
      textTransform: 'uppercase',
      fontSize: '1em',
    },
    subtitle2: {
      fontWeight: 800,
      textTransform: 'uppercase',
      fontSize: '0.875em',
    },
  },

  overrides: {
    MuiButton: {
      root: {
        boxShadow: 'none',
        fontSize: 14,
        '&:hover': {
          boxShadow: 'none',
        },
      },
      contained: {
        backgroundColor: '#eeeeee',
        boxShadow: 'none',
        fontSize: 14,
        '&:hover, selected': {
          boxShadow: 'none',
        },
      },
      containedSecondary: {
        border: '.5px solid #156dac',
        backgroundColor: '#ffffff',
        fontSize: 14,
        color: '#156dac',
        '&:hover': {
          backgroundColor: 'rgb(245, 249, 253, 0.9)',
        },
        '&: selected': {
          backgroundColor: '#599bde',
        },
      },
    },
    MuiListItem: {
      root: {
        '&:hover': {
          backgroundColor: '#eeeeee',
        },
      },
    },
    MuiCheckbox: {
      root: {
        color: '#156dac',
      },
      colorSecondary: {
        color: '#156dac',
        '&$checked': {
          color: '#156dac',
        },
      },
    },
    MuiCard: {
      root: {
        boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
        borderRadius: '8px',
        border: '.5px solid #c2c6ca',
      },
    },
    MuiCardHeader: {
      root: {
        backgroundColor: '#f5f9fd',
      },
    },
    MuiCardActions: {
      root: {
        backgroundColor: '#f9f9f9',
      },
    },
    MuiFormHelperText: {
      root: {
        fontSize: 12,
      },
    },
    MuiTable: {
      root: {
        borderRadius: '8px',
      },
    },
    MuiTableCell: {
      head: {
        color: '#156dac',
        fontWeight: 800,
      },
    },
    MuiTableRow: {
      root: {
        '&:hover': {
          backgroundColor: 'rgb(245, 249, 253, 0.9)',
        },
      },
    },
    MuiTableHead: {
      root: {
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiDivider: {
      root: {
        color: '#c2c6ca',
      },
    },
    MuiFormControl: {
      root: {
        width: '100%',
      },
    },
  },
});

export default theme;
