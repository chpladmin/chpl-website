import React from 'react';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { node, number, string } from 'prop-types';

import { palette, theme } from 'themes';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
    position: 'sticky',
    top: '190px',
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
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '100%',
      height: '90px',
      background: ({ fadeBackground }) => `linear-gradient(to top, ${fadeBackground} 40%, transparent)`,
      pointerEvents: 'none',
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
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      gap: '8px',
      width: '100%',
    },
    [theme.breakpoints.up('md')]: {
      flexWrap: 'nowrap',
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
}) {
  const classes = useStyles({ fadeBackground });

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
};
