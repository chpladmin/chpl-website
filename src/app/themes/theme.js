import { alpha, createTheme } from '@mui/material/styles';

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
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          marginBottom: '4px',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '8px',
          borderRadius: '4px !important',
          '&.Mui-expanded': {
            boxShadow: '0px 4px 8px rgb(149 157 165 / 30%)',
            backgroundColor: paletteColors.background,
            borderRadius: '4px',
            borderBottom: '.5px solid #c2c6ca',
          },
          '&.Mui-focusVisible': {
            border: `2px solid ${paletteColors.black}`,
          },
        },
        content: {
          padding: '0 8px',
        },
        expandIconWrapper: {
          transform: 'none',
          '&.Mui-expanded': {
            transform: 'none',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '16px 0px',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        popupIndicator: {
          marginTop: '4px',
          color: paletteColors.primary,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
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
        // v5 applies styleOverrides after the default variant styles, so the grey in
        // `contained` above now beats the palette background that v4 emitted later in the sheet
        containedPrimary: {
          backgroundColor: paletteColors.primary,
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
        // same v5 precedence flip as containedPrimary: the black border in `outlined`
        // above now beats the palette-derived border MUI emitted later in the v4 sheet
        outlinedPrimary: {
          border: `1px solid ${alpha(paletteColors.primary, 0.5)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
          borderRadius: '8px',
          border: `.5px solid ${paletteColors.secondaryDark}`,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px',
          '&:last-child': {
            paddingBottom: '16px',
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          backgroundColor: paletteColors.background,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          backgroundColor: paletteColors.secondary,
          borderBottom: `.5px solid ${paletteColors.secondaryDark}`,
        },
        title: {
          fontWeight: '600',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: paletteColors.primary,
        },
        colorSecondary: {
          color: paletteColors.primary,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
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
    },
    MuiCssBaseline: {
      // element-level rules that used to come from bootstrap and index.scss
      styleOverrides: {
        html: {
          // bootstrap's root size; every rem in the app, MUI's included, is sized against it
          fontSize: '10px',
        },
        body: {
          backgroundColor: paletteColors.white,
          color: '#1c1c1c',
          fontFamily: 'Lato, sans-serif',
          fontSize: '14px',
          lineHeight: 1.428571429,
        },
        'input, button, select, textarea': {
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
        },
        a: {
          color: '#1a67a9',
          textDecoration: 'underline',
        },
        'a:hover, a:focus': {
          color: '#23527c',
        },
        ':focus': {
          outlineOffset: '-2px',
        },
        'h1, h2, h3, h4, h5, h6': {
          color: 'inherit',
          fontFamily: 'inherit',
          lineHeight: 1.1,
        },
        'h1, h2, h3': {
          marginBottom: '10px',
          marginTop: '20px',
        },
        'h4, h5, h6': {
          marginBottom: '10px',
          marginTop: '10px',
        },
        h1: {
          fontSize: '2.5em',
          fontWeight: 900,
        },
        h2: {
          fontSize: '2em',
          fontWeight: 600,
        },
        h3: {
          fontSize: '1.75em',
          fontWeight: 500,
        },
        h4: {
          fontSize: '1.5em',
          fontWeight: 900,
        },
        h5: {
          fontSize: '1.25em',
          fontWeight: 600,
        },
        h6: {
          fontSize: '1.25em',
          fontWeight: 500,
        },
        p: {
          fontSize: '1em',
          fontWeight: 400,
          margin: '0 0 10px',
        },
        'ul, ol': {
          marginBottom: '10px',
          marginTop: 0,
        },
        'ul ul, ul ol, ol ul, ol ol': {
          marginBottom: 0,
        },
        dl: {
          marginBottom: '20px',
          marginTop: 0,
        },
        'dt, dd': {
          lineHeight: 1.428571429,
        },
        dt: {
          fontWeight: 700,
        },
        dd: {
          marginLeft: 0,
        },
        label: {
          color: '#1c1c1c',
          display: 'inline-block',
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '5px',
          maxWidth: '100%',
          textTransform: 'uppercase',
        },
        '::placeholder': {
          color: '#333 !important',
        },
        'option[disabled], option[label^="Removed"], option[label^="Retired"]': {
          fontStyle: 'italic',
        },
        img: {
          border: 0,
          verticalAlign: 'middle',
        },
        'code, pre': {
          fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
        },
        code: {
          backgroundColor: '#f9f2f4',
          borderRadius: '4px',
          color: '#c7254e',
          fontSize: '90%',
          padding: '2px 4px',
        },
        pre: {
          backgroundColor: '#f5f5f5',
          border: '1px solid #ccc',
          borderRadius: '4px',
          color: '#333',
          display: 'block',
          fontSize: '13px',
          lineHeight: 1.428571429,
          margin: '0 0 10px',
          overflowWrap: 'break-word',
          padding: '9.5px',
          wordBreak: 'break-all',
        },
        'pre code': {
          backgroundColor: 'transparent',
          borderRadius: 0,
          color: 'inherit',
          fontSize: 'inherit',
          padding: 0,
          whiteSpace: 'pre-wrap',
        },
        // activity history is rendered from html strings, which can't carry a class
        '.removed': {
          fontStyle: 'italic',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        dividers: {
          padding: '16px',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          color: paletteColors.secondaryDark,
          margin: '8px 0',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: '4px',
          marginRight: '8px',
          marginBottom: '0',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: 12,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          fontSize: '2em',
          verticalAlign: 'text-top',
          color: paletteColors.error,
          '&.Mui-error': {
            color: paletteColors.error,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        shrink: {
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 21%, rgba(255,255,255,1) 74%, rgba(255,255,255,1) 75%, rgba(255,255,255,0) 76%, rgba(255,255,255,0) 100%)',
          padding: '0 4px',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        padding: {
          paddingTop: '0',
          paddingBottom: '0',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgb(0 0 0 / 10%)',
          },
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontSize: '0.875em',
          color: paletteColors.black,
        },
        gutters: {
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: '8px',
        },
        elevation1: {
          boxShadow: '0px 4px 8px rgb(149 157 165 / 10%)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          top: 0,
          position: 'inherit',
          color: paletteColors.primary,
        },
        select: {
          '&:focus': {
            backgroundColor: paletteColors.white,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: paletteColors.primary,
        },
        colorSecondary: {
          '&.Mui-checked': {
            color: paletteColors.primary,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '.9em',
        },
        textColorPrimary: {
          color: paletteColors.primary,
          '&.Mui-selected': {
            fontWeight: 'bold',
            color: paletteColors.black,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: paletteColors.black,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
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
    },
    MuiTableHead: {
      styleOverrides: {
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
    },
    MuiTablePagination: {
      styleOverrides: {
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
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgb(245, 249, 253, 0.9)',
          },
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        // v5 treats active as a state class, not a slot; it must be nested under root
        root: {
          '&.Mui-active': {
            color: paletteColors.black,
          },
        },
        icon: {
          color: paletteColors.black,
        },
      },
    },
    MuiTimelineItem: {
      styleOverrides: {
        // v5's overridesResolver ignores a missingOppositeContent slot; it must be nested under root
        root: {
          '&.MuiTimelineItem-missingOppositeContent::before': {
            display: 'none',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          paddingTop: '18.5px',
          paddingBottom: '14px',
        },
        inputSizeSmall: {
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
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          flexDirection: 'column',
        },
        label: {
          fontWeight: '500',
          '&.Mui-active': {
            fontWeight: '600',
          },
        },
        iconContainer: {
          paddingRight: '0',
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          fontSize: '1.7em',
          '&.Mui-active': {
            boxShadow: '1px 0px 4px 4px #156dac50',
            borderRadius: '64px',
          },
          '&.Mui-completed': {
            color: '#356635',
          },
        },
        text: {
          fontSize: '1rem',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        colorPrimary: {
          color: `${paletteColors.primary} !important`,
        },
      },
    },
  },
});

export default theme;
