import { createTheme } from '@material-ui/core/styles';

import paletteColors from './palette';

const theme = createTheme({
  root: {
    width: '100%',
    display: 'flex',
  },
  spacing: 4,
  palette: {
    background: {
      default: paletteColors.background,
    },
    primary: {
      light: '#599bde',
      main: paletteColors.primary,
      dark: '#00437c',
      contrastText: paletteColors.white,
    },
    secondary: {
      light: paletteColors.secondaryLight,
      main: paletteColors.secondary,
      dark: paletteColors.secondaryDark,
      contrastText: paletteColors.white,
    },
    error: {
      main: paletteColors.error,
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
      lineHeight: '1.3em',
    },
    body1: {
      fontSize: '1em',
      lineHeight: '1.3em',
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
    MuiAccordion: {
      root: {
        marginBottom: '4px',
      },
    },
    MuiAccordionSummary: {
      root: {
        padding: '8px',
        borderRadius: '4px !important',
        '&$expanded': {
          boxShadow: '0px 4px 8px rgb(149 157 165 / 30%)',
          backgroundColor: paletteColors.background,
          borderRadius: '4px',
          borderBottom: '.5px solid #c2c6ca',
        },
        '&$focusVisible': {
          border: `2px solid ${paletteColors.black}`,
        },
      },
      content: {
        padding: '0 8px',
      },
      expandIcon: {
        transform: 'none',
        '&$expanded': {
          transform: 'none',
        },
      },
    },
    MuiAccordionDetails: {
      root: {
        padding: '16px 0px',
      },
    },
    MuiAutocomplete: {
      popupIndicator: {
        marginTop: '4px',
        color: paletteColors.primary,
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
        '&:disabled': {
          backgroundColor: '#eeeeee',
        },
      },
      containedSecondary: {
        border: `.5px solid ${paletteColors.primary}`,
        backgroundColor: paletteColors.white,
        fontSize: '1em',
        color: paletteColors.primary,
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
      outlined: {
        border: `${paletteColors.black} solid 1px`,
      },
    },
    MuiCard: {
      root: {
        boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
        borderRadius: '8px',
        border: `.5px solid ${paletteColors.secondaryDark}`,
      },
    },
    MuiCardContent: {
      root: {
        padding: '16px',
        '&:last-child': {
          paddingBottom: '16px',
        },
      },
    },
    MuiCardActions: {
      root: {
        backgroundColor: paletteColors.background,
      },
    },
    MuiCardHeader: {
      root: {
        backgroundColor: paletteColors.secondary,
        borderBottom: `.5px solid ${paletteColors.secondaryDark}`,
      },
      title: {
        fontWeight: '600',
      },
    },
    MuiCheckbox: {
      root: {
        color: paletteColors.primary,
      },
      colorSecondary: {
        color: paletteColors.primary,
      },
    },
    MuiChip: {
      root: {
        fontSize: '.8em',
      },
      outlinedPrimary: {
        backgroundColor: paletteColors.white,
        fontWeight: '600',
      },
      deleteIcon: {
        width: '16px',
        height: '16px',
        color: '#bbb',
      },
      deleteIconOutlinedColorPrimary: {
        color: '#bbb',
        '&:hover, selected': {
          color: paletteColors.error,
        },
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
        color: paletteColors.secondaryDark,
        margin: '8px 0',
      },
    },
    MuiFormControl: {
      root: {
        width: '100%',
      },
    },
    MuiFormControlLabel: {
      root: {
        marginLeft: '4px',
        marginRight: '8px',
        marginBottom: '0',
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
        verticalAlign: 'text-top',
        color: paletteColors.error,
        '&$error': {
              color: paletteColors.error,
          },
        },
      },
    MuiInputLabel: {
      shrink: {
        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 21%, rgba(255,255,255,1) 74%, rgba(255,255,255,1) 75%, rgba(255,255,255,0) 76%, rgba(255,255,255,0) 100%)',
        padding: '0 4px',
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
        color: paletteColors.black,
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
      },
    },
    MuiSelect: {
      icon: {
        position: 'inherit',
        color: paletteColors.primary,
      },
      select: {
        '&:focus': {
          backgroundColor: paletteColors.white,
        },
      },
    },
    MuiRadio: {
      root: {
        color: paletteColors.primary,
      },
      colorSecondary: {
        '&$checked': {
          color: paletteColors.primary,
        },
      },
    },
    MuiTab: {
      root: {
        fontSize: '.9em',
      },
      textColorPrimary: {
        color: paletteColors.primary,
        '&$selected': {
          fontWeight: 'bold',
          color: paletteColors.black,
        },
      },
    },
    MuiTabs: {
      indicator: {
        backgroundColor: paletteColors.black,
      },
    },
    MuiTable: {
      root: {
        borderRadius: '8px',
      },
    },
    MuiTableCell: {
      root: {
        fontSize: '1em',
      },
      head: {
        color: paletteColors.primary,
        fontWeight: 800,
      },
      stickyHeader: {
        backgroundColor: paletteColors.white,
      },
    },
    MuiTableHead: {
      root: {
        borderRadius: '8px',
        backgroundColor: paletteColors.white,
        top: '0',
        position: 'sticky',
        zIndex: '100',
        boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
        '&:hover': {
          backgroundColor: paletteColors.white,
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
        backgroundColor: paletteColors.white,
        margin: '16px',
        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
        borderRadius: '64px',
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 32px',
        paddingRight: '16px',
      },
      select: {
        color: paletteColors.primary,
        fontWeight: '500',
      },
      actions: {
        color: paletteColors.primary,
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
        color: paletteColors.black,
      },
      icon: {
        color: paletteColors.black,
      },
    },
    MuiTimelineItem: {
      missingOppositeContent: {
        '&:before': {
          display: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      input: {
        paddingTop: '18.5px',
        paddingBottom: '14px',
      },
      inputMarginDense: {
        paddingTop: '14.5px',
        paddingBottom: '10px',
      },
      multiline: {
        paddingTop: '14.5px',
        paddingBottom: '10px',
      },
      inputMultiline: {
        height: '256px',
      },
    },
    MuiStepLabel: {
      root: {
        flexDirection: 'column',
      },
      label: {
        fontWeight: '500',
        '&$active': {
          fontWeight: '600',
        },
      },
      iconContainer: {
        paddingRight: '0',
      },
    },
    MuiStepIcon: {
      root: {
        fontSize: '1.7em',
        '&$active': {
          boxShadow: '1px 0px 4px 4px #156dac50',
          borderRadius: '64px',
        },
        '&$completed': {
          color: '#356635',
        },
      },
      text: {
        fontSize: '1rem',
      },
    },
    MuiSvgIcon: {
      colorPrimary: {
        color: `${paletteColors.primary} !important`,
      },
    },
  },
});

export default theme;
