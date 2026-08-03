import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
    color: palette.primary,
    borderColor: palette.primaryBorder,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sidebarToggleMobileOnly: {
    justifyContent: 'space-between',
    color: palette.primary,
    borderColor: palette.primaryBorder,
  },
  sidebarToggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  countChip: {
    backgroundColor: palette.primary,
    color: palette.white,
    fontWeight: 600,
    height: '18px',
    fontSize: '0.7rem',
    '& .MuiChip-labelSmall': {
      paddingLeft: '6px',
      paddingRight: '6px',
    },
  },
  emptyCard: {
    width: '100%',
    // sit above the results-controls fade (content z-index 1) but below the sticky search bar (z-index 3)
    // so the message stays readable at rest yet tucks under the search when scrolling on mobile
    position: 'relative',
    zIndex: 2,
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
    position: 'relative',
    zIndex: 1,
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

  const appliedCount = filterContext.filters
    .reduce((sum, filter) => sum + (filter.values?.filter((v) => v.selected).length ?? 0), 0);

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
                No filters applied. Please use the Filters button to apply filters and view results.
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
            { appliedCount > 0
              && <Chip size="small" label={appliedCount} className={classes.countChip} /> }
          </span>
        </Button>
        {isDesktop
          ? <ChplFilterChips />
          : (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <ChplFilterChips horizontal />
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
