import React from 'react';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { node, number } from 'prop-types';

import { palette, theme } from 'themes';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '16px 32px',
    backgroundColor: palette.white,
    borderRadius: '0px 0px 8px 8px',
    boxShadow: `0px 2px 4px -1px ${theme.palette.grey[300]}, 0px 4px 5px 0px ${theme.palette.grey[300]}, 0px 1px 10px 0px ${theme.palette.grey[300]}`,
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  results: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
});

function ChplSearchResultControls({
  recordCount,
  pageStart,
  pageEnd,
  children = undefined,
}) {
  const classes = useStyles();

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
          <Box display="flex" alignItems="center" flexDirection="row" gridGap="2px">
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
};
