import React from 'react';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  bool, node, number, string,
} from 'prop-types';

import { palette, theme } from 'themes';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
    position: ({ sticky }) => (sticky ? 'sticky' : 'static'),
    top: '96px',
    zIndex: 2,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '16px 32px',
    backgroundColor: palette.white,
    borderRadius: '0px 0px 8px 8px',
    borderRight: `1px solid ${palette.divider}`,
    borderBottom: `1px solid ${palette.divider}`,
    borderLeft: `1px solid ${palette.divider}`,
    boxShadow: `0px 6px 8px -4px ${theme.palette.grey[300]}`,
    '&::before': {
      content: ({ sticky }) => (sticky ? '""' : 'none'),
      position: 'absolute',
      left: '-1px',
      right: '-1px',
      bottom: '100%',
      height: '24px',
      background: ({ fadeBackground }) => `linear-gradient(to top, ${fadeBackground} 40%, transparent)`,
      pointerEvents: 'none',
      zIndex: 1,
    },
    [theme.breakpoints.down('sm')]: {
      gap: '12px',
      padding: '16px',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  results: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    flexWrap: ({ wrapActions }) => (wrapActions ? 'wrap' : 'nowrap'),
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      gap: '8px',
      width: '100%',
    },
    [theme.breakpoints.up('md')]: {
      gap: '2px',
      width: 'auto',
      '& > *': {
        flex: '0 1 auto',
        width: 'auto',
      },
    },
  },
});

function ChplSearchResultControls({
  recordCount,
  pageStart,
  pageEnd,
  children = undefined,
  fadeBackground = palette.backgroundPage,
  sticky = true,
  wrapActions = false,
}) {
  const classes = useStyles({ fadeBackground, sticky, wrapActions });

  return (
    <div className={classes.container}>
      <div className={classes.results}>
        <Typography variant="subtitle2">Search Results:</Typography>
        { recordCount === 0
          && (
            <Typography>
              No results found
            </Typography>
          )}
        { recordCount > 0
          && (
            <Typography variant="body2">
              {`(${pageStart}-${pageEnd} of ${recordCount} Results)`}
            </Typography>
          )}
      </div>
      { recordCount > 0 && children
        && (
          <Box className={classes.actions}>
            { children }
          </Box>
        )}
    </div>
  );
}

export default ChplSearchResultControls;

ChplSearchResultControls.propTypes = {
  recordCount: number.isRequired,
  pageStart: number.isRequired,
  pageEnd: number.isRequired,
  children: node,
  fadeBackground: string,
  sticky: bool,
  wrapActions: bool,
};
