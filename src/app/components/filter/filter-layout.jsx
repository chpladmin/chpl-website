import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { node } from 'prop-types';

import ChplFilterChips from './filter-chips';
import { useFilterContext } from './filter-context';

import { palette, theme } from 'themes';

const useStyles = makeStyles({
  layoutContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'start',
    margin: '16px 0px',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '260px 1fr',
      gap: '24px',
    },
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    [theme.breakpoints.up('md')]: {
      position: 'sticky',
      top: '16px',
      borderRight: `1px solid ${palette.greyBorder}`,
    },
  },
  sidebarToggle: {
    justifyContent: 'space-between',
    color: palette.black,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sidebarToggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  content: {
    minWidth: 0,
  },
});

function ChplFilterLayout({ children }) {
  const classes = useStyles();
  const filterContext = useFilterContext();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [expanded, setExpanded] = useState(false);

  const hasAppliedFilters = filterContext.filters
    .some((filter) => filter.values?.some((v) => v.selected));

  useEffect(() => {
    if (isDesktop) { setExpanded(false); }
  }, [isDesktop]);

  if (!hasAppliedFilters) {
    return (
      <div className={classes.content}>
        {children}
      </div>
    );
  }

  return (
    <div className={classes.layoutContainer}>
      <Box className={classes.sidebar}>
        <Button
          className={classes.sidebarToggle}
          variant="outlined"
          fullWidth
          id="filter-layout-sidebar-toggle"
          onClick={() => setExpanded((prev) => !prev)}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          <span className={classes.sidebarToggleLabel}>
            <FilterListIcon />
            Filters
          </span>
        </Button>
        {isDesktop
          ? <ChplFilterChips />
          : (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <ChplFilterChips />
            </Collapse>
          )}
      </Box>
      <div className={classes.content}>
        {children}
      </div>
    </div>
  );
}

export default ChplFilterLayout;

ChplFilterLayout.propTypes = {
  children: node,
};

ChplFilterLayout.defaultProps = {
  children: undefined,
};
