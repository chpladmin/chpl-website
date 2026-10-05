import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Chip, Collapse, Typography, useMediaQuery,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import LabelOffIcon from '@mui/icons-material/LabelOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { bool, node } from 'prop-types';

import ChplFilterChips from './filter-chips';
import { useFilterContext } from './filter-context';

import { palette, theme } from 'themes';

const styles = {
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
      top: '96px',
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
    backgroundColor: palette.white,
    border: `1px solid ${palette.primaryBorder}`,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sidebarToggleMobileOnly: {
    justifyContent: 'space-between',
    color: palette.primary,
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
};

function ChplFilterLayout({ children = undefined, mobileOnly = false }) {
  const filterContext = useFilterContext();
  const isDesktopWidth = useMediaQuery(theme.breakpoints.up('md'));
  const isDesktop = isDesktopWidth && !mobileOnly;
  const [expanded, setExpanded] = useState(false);

  const hasAppliedFilters = filterContext.filters
    .some((filter) => filter.values?.some((v) => v.selected));

  const appliedCount = filterContext.filters
    .reduce((sum, filter) => sum + (filter.values?.filter((v) => v.selected).length ?? 0), 0);

  // On desktop the chips always render, so collapse the mobile toggle when the
  // viewport crosses into desktop width; this keeps it collapsed if it returns to mobile.
  useEffect(() => {
    if (isDesktop) { setExpanded(false); }
  }, [isDesktop]);

  if (!hasAppliedFilters) {
    return (
      <Box sx={mobileOnly ? styles.layoutContainerMobileOnly : styles.layoutContainer}>
        <Box sx={mobileOnly ? styles.sidebarMobileOnly : styles.sidebar}>
          <Card sx={styles.emptyCard}>
            <CardContent sx={styles.emptyContent}>
              <LabelOffIcon sx={styles.emptyIcon} />
              <Typography variant="body2">
                No filters applied. Please use the Filters button to apply filters and view results.
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={styles.content}>
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={mobileOnly ? styles.layoutContainerMobileOnly : styles.layoutContainer}>
      <Box sx={mobileOnly ? styles.sidebarMobileOnly : styles.sidebar}>
        <Button
          sx={mobileOnly ? styles.sidebarToggleMobileOnly : styles.sidebarToggle}
          variant="outlined"
          fullWidth
          id="filter-layout-sidebar-toggle"
          onClick={() => setExpanded((prev) => !prev)}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          <Box component="span" sx={styles.sidebarToggleLabel}>
            <FilterListIcon />
            Filters Applied
            { appliedCount > 0
              && <Chip size="small" label={appliedCount} sx={styles.countChip} /> }
          </Box>
        </Button>
        {isDesktop
          ? <ChplFilterChips />
          : (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <ChplFilterChips horizontal />
            </Collapse>
          )}
      </Box>
      <Box sx={styles.content}>
        {children}
      </Box>
    </Box>
  );
}

export default ChplFilterLayout;

ChplFilterLayout.propTypes = {
  children: node,
  mobileOnly: bool,
};
