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
    MuiAccordionSummary:{
      root:{
        backgroundColor:'#f5f9fd',
        padding:'4px 8px',
      },
      content:{
        padding:'4px',
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: '8px',
      },
      elevation1:{
        boxShadow:'0px 4px 8px rgb(149 157 165 / 10%)',
      }
    },
    MuiButton: {
      root: {
        boxShadow: 'none',
        fontSize:'1em',
        '&:hover': {
          boxShadow: 'none',
        },
        whiteSpace:'nowrap',
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
      containedSizeSmall:{
        fontSize: '0.875em',
      },
      containedSizeLarge:{
        fontSize: '1.125em',
      },
    },
    MuiDialogTitle: {
      root: {
        fontSize:800,
        '& h6': {
          fontSize:800,
        },
      },
    },
    MuiList:{
      padding:{
        paddingTop:'0',
        paddingBottom:'0',
      },
    },
    MuiListItem: {
      root: {
        '&:hover': {
          backgroundColor: '#eeeeee',
        },
      },
    },
    MuiListSubheader:{
      root:{
        fontSize:'0.875em',
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
    MuiChip: {
      root: {
        fontSize: '.8em',
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
      root:{
        fontSize:"1em",
      },
      head: {
        color: '#156dac',
        fontWeight: 800,
      },
      stickyHeader:{
        backgroundColor: '#ffffff'
      }
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
    MuiTableSortLabel:{
      active:{
        color:'#000000',
      },

      icon:{
        color:'#000000',
      },
    },
    MuiDivider: {
      root: {
        color: '#c2c6ca',
        margin: '8px 0',
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
    MuiFormControl: {
      root: {
        width: '100%',
      },
    },
    MuiTableFooter:{
      root:{

      },
    },
    MuiTablePagination:{
      root:{
        fontSize:'1em',
        display:'grid',
        justifyContent:'space-evenly',
      },
      spacer:{
        flex:'none',
      },
      toolbar:{
        backgroundColor:'#ffffff',
        margin:'16px',
        boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
        borderRadius:'64px',
        display:'flex',
        justifyContent:'center',
        padding:'8px 32px',
      },
      select:{
        color:'#156dac',
        fontWeight:'500',
      },
      actions:{
        color:'#156dac',
      },
    },
    MuiSelect:{
      icon:{
        position:'inherit',
        color:'#156dac',
      },
    },

  },
});

export default theme;
