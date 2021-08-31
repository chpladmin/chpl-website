import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  root: {
    width: '100%',
    display: 'flex',
  },
  spacing: 4,

   /*Start of CHPL Colorwave*/
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
    error: {
      main: '#c44f65',
    },
  },
 /*End of CHPL Colorwave*/

 /*Start of Typography*/ 
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
      fontWeight: 400,
    },
    h4: {
      fontSize: '1.5em',
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.25em',
      fontWeight: 400,
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
/*End of Typography*/

/*Start of Overides */
  overrides: {
    MuiAccordionSummary: {
      root: {
        backgroundColor: '#f5f9fd',
        padding: '4px 8px',
      },
      content: {
        padding: '4px',
      },
    },
    MuiButton: {
      root: {
        boxShadow: 'none',
        fontSize: '1em',
        '&:hover': {
          boxShadow: 'none',
        },
        whiteSpace: 'nowrap',
      },
      contained: {
        backgroundColor: '#eeeeee',
        boxShadow: 'none',
        fontSize: '1em',
        '&:hover, selected': {
          boxShadow: 'none',
        },
      },
      containedSecondary: {
        border: '.5px solid #156dac',
        backgroundColor: '#ffffff',
        fontSize: '1em',
        color: '#156dac',
        '&:hover': {
          backgroundColor: 'rgb(245, 249, 253, 0.9)',
        },
        '&: selected': {
          backgroundColor: '#599bde',
        },
      },
      containedSizeSmall: {
        fontSize: '0.875em',
      },
      containedSizeLarge: {
        fontSize: '1.125em',
      },
    },
    MuiCard: {
      root: {
        boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
        borderRadius: '8px',
        border: '.5px solid #c2c6ca',
      },
    },
    MuiCardActions: {
      root: {
        backgroundColor: '#f9f9f9',
      },
    },
    MuiCardHeader: {
      root: {
        backgroundColor: '#f5f9fd',
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
    MuiChip: {
      root: {
        fontSize: '.8em',
      },
    },
    MuiDialogActions: {
      root: {
        padding: '16px',
      },
    },
    MuiDialogContent: {
      dividers: {
        padding: '16px',
      },
    },
    MuiDialogTitle: {
      root: {
        padding: '16px',
      },
    },
    MuiDivider: {
      root: {
        color: '#c2c6ca',
        margin: '8px 0',
      },
    },
    MuiFormControl: {
      root: {
        width: '100%',
      },
    },
    MuiFormHelperText: {
      root: {
        fontSize: 12,
      },
    },
    MuiFormLabel: {
      asterisk: {
        fontSize: '2em',
        verticalAlign: 'top',
      },
    },
    MuiList: {
      padding: {
        paddingTop: '0',
        paddingBottom: '0',
      },
    },
    MuiListItem: {
      root: {
        '&:hover': {
          backgroundColor: 'rgb(0 0 0 / 10%)',
        },
      },
    },
    MuiListSubheader: {
      root: {
        fontSize: '0.875em',
      },
      gutters: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: '8px',
      },
      elevation1: {
        boxShadow: '0px 4px 8px rgb(149 157 165 / 10%)',
      }
    },
    MuiSelect: {
      icon: {
        position: 'inherit',
        color: '#156dac',
      },
    },
    MuiTable: {
      root: {
        borderRadius: '8px',
      },
    },
    MuiTableCell: {
      root: {
        fontSize: "1em",
      },
      head: {
        color: '#156dac',
        fontWeight: 800,
      },
      stickyHeader: {
        backgroundColor: '#ffffff'
      }
    },
    MuiTableHead: {
      root: {
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTablePagination: {
      root: {
        fontSize: '1em',
        display: 'grid',
        justifyContent: 'space-evenly',
      },
      spacer: {
        flex: 'none',
      },
      toolbar: {
        backgroundColor: '#ffffff',
        margin: '16px',
        boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
        borderRadius: '64px',
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 32px',
      },
      select: {
        color: '#156dac',
        fontWeight: '500',
      },
      actions: {
        color: '#156dac',
      },
    },
    MuiTableRow: {
      root: {
        '&:hover': {
          backgroundColor: 'rgb(245, 249, 253, 0.9)',
        },
      },
    },
    MuiTableSortLabel: {
      active: {
        color: '#000000',
      },
      icon: {
        color: '#000000',
      },
    },
  },
});
/*End of Overides */
export default theme;