import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Typography,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import LabelOffIcon from '@material-ui/icons/LabelOff';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { bool, node } from 'prop-types';

import ChplFilterChips from './filter-chips';
import { useFilterContext } from './filter-context';

import { palette, theme } from 'themes';

const useStyles = makeStyles({
  layoutContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'start',
    margin: '16px 0',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '260px 1fr',
      gap: '24px',
    },
  },
  layoutContainerMobileOnly: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'start',
    margin: '16px 0',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    [theme.breakpoints.up('md')]: {
      position: 'sticky',
      top: '190px',
    },
  },
  sidebarMobileOnly: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sidebarToggle: {
    justifyContent: 'space-between',
    color: palette.black,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sidebarToggleMobileOnly: {
    justifyContent: 'space-between',
    color: palette.black,
  },
  sidebarToggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  emptyCard: {
    width: '100%',
  },
  emptyContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
  },
  emptyIcon: {
    fontSize: '2rem',
  },
  content: {
    minWidth: 0,
  },
});

function ChplFilterLayout({ children, mobileOnly }) {
  const classes = useStyles();
  const filterContext = useFilterContext();
  const isDesktopWidth = useMediaQuery(theme.breakpoints.up('md'));
  const isDesktop = isDesktopWidth && !mobileOnly;
  const [expanded, setExpanded] = useState(false);

  const hasAppliedFilters = filterContext.filters
    .some((filter) => filter.values?.some((v) => v.selected));

  useEffect(() => {
    if (isDesktop) { setExpanded(false); }
  }, [isDesktop]);

  if (!hasAppliedFilters) {
    return (
      <div className={mobileOnly ? classes.layoutContainerMobileOnly : classes.layoutContainer}>
        <Box className={mobileOnly ? classes.sidebarMobileOnly : classes.sidebar}>
          <Card className={classes.emptyCard}>
            <CardContent className={classes.emptyContent}>
              <LabelOffIcon className={classes.emptyIcon} />
              <Typography variant="body2">
                No filters applied. Please use the advanced search to apply filters and view results.
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <div className={classes.content}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={mobileOnly ? classes.layoutContainerMobileOnly : classes.layoutContainer}>
      <Box className={mobileOnly ? classes.sidebarMobileOnly : classes.sidebar}>
        <Button
          className={mobileOnly ? classes.sidebarToggleMobileOnly : classes.sidebarToggle}
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
  mobileOnly: bool,
};

ChplFilterLayout.defaultProps = {
  children: undefined,
  mobileOnly: false,
};
