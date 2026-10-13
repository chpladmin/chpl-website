import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import {
  bool, node, number, string,
} from 'prop-types';

import { CmsContext, CompareContext } from 'shared/contexts';
import { palette, theme } from 'themes';

const getStyles = ({ fadeBackground, sticky, wrapActions }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
    position: sticky ? 'sticky' : 'static',
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
      content: sticky ? '""' : 'none',
      position: 'absolute',
      left: '-1px',
      right: '-1px',
      bottom: '100%',
      height: '24px',
      background: `linear-gradient(to top, ${fadeBackground} 40%, transparent)`,
      pointerEvents: 'none',
      zIndex: 1,
    },
    [theme.breakpoints.down('md')]: {
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
    flexWrap: wrapActions ? 'wrap' : 'nowrap',
    [theme.breakpoints.down('md')]: {
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
  const { isOpen: cmsIsOpen } = useContext(CmsContext);
  const { isOpen: compareIsOpen } = useContext(CompareContext);
  // an open widget narrows the page without changing the viewport, so breakpoints alone won't wrap
  const styles = getStyles({ fadeBackground, sticky, wrapActions: wrapActions || cmsIsOpen || compareIsOpen });

  return (
    <Box sx={styles.container}>
      <Box sx={styles.results}>
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
      </Box>
      { recordCount > 0 && children
        && (
          <Box sx={styles.actions}>
            { children }
          </Box>
        )}
    </Box>
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
