import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  number,
  object,
  string,
} from 'prop-types';

import ChplFilterBrowse from './filter-browse';
import ChplFilterPanel from './filter-panel';
import ChplFilterQuickFilters from './filter-quick-filters';
import ChplFilterSearchTerm from './filter-search-term';
import { useFilterContext } from './filter-context';

import { palette, theme } from 'themes';

const useStyles = makeStyles({
  searchContainer: {
    backgroundColor: palette.grey,
    padding: '16px 32px',
    display: 'grid',
    borderRadius: '8px',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '16px',
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr auto',
    },
  },
  searchButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gridGap: '8px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      width: '100%',
      '& > *': {
        flex: '0 0 auto',
      },
    },
  },
  sticky: {
    position: 'sticky',
    top: '100px',
    zIndex: 3,
  },
  stuck: {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '100%',
      height: '100px',
      background: ({ fadeBackground }) => `linear-gradient(to top, ${fadeBackground} 55%, transparent)`,
      pointerEvents: 'none',
    },
  },
});

function ChplFilterSearchBar({
  fadeBackground = palette.backgroundPage,
  filterGridMinColWidth = 200,
  hideAdvancedSearch = false,
  hideSearchTerm = false,
  placeholder = 'Search by Developer, Product, or CHPL ID...',
  sticky = false,
  toggleMultipleFilters = undefined,
}) {
  const { filters } = useFilterContext();
  const classes = useStyles({ fadeBackground });
  const sentinelRef = useRef(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!sticky) { return undefined; }
    const sentinel = sentinelRef.current;
    if (!sentinel) { return undefined; }
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { rootMargin: '-100px 0px 0px 0px', threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sticky]);

  const searchBar = (
    <div
      className={sticky ? `${classes.searchContainer} ${classes.sticky} ${isStuck ? classes.stuck : ''}` : classes.searchContainer}
      data-filter-search-bar="true"
    >
      { !hideSearchTerm
        && (
          <ChplFilterSearchTerm
            placeholder={placeholder}
          />
        )}
      <Box className={classes.searchButtonContainer}>
        <ChplFilterBrowse />
        { !hideAdvancedSearch
          && (
            <ChplFilterPanel filterGridMinColWidth={filterGridMinColWidth} />
          )}
        { filters.some((f) => f.key === 'quickFilters')
          && (
            <ChplFilterQuickFilters
              toggleMultipleFilters={toggleMultipleFilters}
            />
          )}
      </Box>
    </div>
  );

  if (!sticky) {
    return searchBar;
  }

  return (
    <>
      <div ref={sentinelRef} />
      {searchBar}
    </>
  );
}

export default ChplFilterSearchBar;

ChplFilterSearchBar.propTypes = {
  fadeBackground: string,
  filterGridMinColWidth: number,
  hideAdvancedSearch: bool,
  hideSearchTerm: bool,
  placeholder: string,
  sticky: bool,
  toggleMultipleFilters: arrayOf(object),
};
