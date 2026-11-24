import { palette, theme } from 'themes';

// The System Maintenance pages share one look for their results: a bordered
// header bar above bordered cards. Passed to the shared result components
// through their `sx` prop, so the rest of the site keeps its own look.
const border = `1px solid ${palette.divider}`;

const buttonHeight = 40;

const resultsHeaderSx = {
  border,
  borderRadius: '8px',
  boxShadow: `0px 6px 8px -4px ${theme.palette.grey[300]}`,
  marginBottom: '16px',
  // The fade above a sticky header is positioned from the padding box, which
  // sits inside the border, so by default it paints over the top border
  '&::before': {
    bottom: 'calc(100% + 1px)',
  },
  // Space the actions evenly; the History button used to add its own margin
  '& > :last-child': {
    gap: '12px',
    // the sort control brings a 16px margin of its own, which made the gap
    // after it wider than the others
    '& > .MuiCard-root': {
      marginRight: 0,
    },
  },
  // Every button in the header (sort, History, Add, downloads...) gets the same
  // height, type and icon size. The sort buttons sit inside a 1px bordered card,
  // so they are 2px shorter to line up with the rest
  '& .MuiButton-root': {
    boxSizing: 'border-box',
    height: `${buttonHeight}px`,
    minHeight: `${buttonHeight}px`,
    padding: '0 16px',
    fontSize: '14px',
    lineHeight: 1.25,
    whiteSpace: 'nowrap',
    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
      margin: 0,
    },
    '& .MuiButton-startIcon': {
      marginRight: '8px',
    },
    '& .MuiButton-endIcon': {
      marginLeft: '8px',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '20px',
    },
  },
  '& .MuiButtonGroup-grouped': {
    height: `${buttonHeight - 2}px`,
    minHeight: `${buttonHeight - 2}px`,
  },
  '& .MuiButtonGroup-grouped:last-of-type': {
    minWidth: '40px',
    padding: 0,
  },
};

const resultCardSx = {
  border,
};

export { resultCardSx, resultsHeaderSx };
