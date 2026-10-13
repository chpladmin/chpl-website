import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  FormControlLabel,
  List,
  ListSubheader,
  Popover,
  Switch,
  Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { number } from 'prop-types';

import { useFilterContext } from './filter-context';

import { eventTrack } from 'services/analytics.service';
import { palette, theme } from 'themes';

const styles = {
  advancedSearchButton: {
    color: palette.black,
  },
  directionText: {
    marginBottom: '8px',
  },
  filterPanelContainer: {
    background: palette.white,
    display: 'grid',
    gridTemplateColumns: '1fr',
    rowGap: '16px',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    },
  },
  filterPanelFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '8px 16px',
    borderTop: `1px solid ${palette.primaryBorder}`,
  },
  filterPanelPrimary: {
    padding: '16px',
  },
  filterPanelSecondary: {
    padding: '16px',
    borderTop: `1px solid ${palette.primaryBorder}`,
    [theme.breakpoints.up('md')]: {
      borderTop: 'none',
      borderLeft: `1px solid ${palette.primaryBorder}`,
    },
  },
  filterBold: {
    fontWeight: '600',
  },
  filterContainer: {
    display: 'grid',
    justifyItems: 'start',
    alignItems: 'start',
    gap: '16px',
    padding: '0 8px',
    marginTop: '16px',
  },
  filterHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
  },
  filterGroupTwoContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    minHeight: '8vh',
    maxHeight: '40vh',
    overflowY: 'auto',
  },
  filterSubHeaderContainer: {
    display: 'grid',
  },
  clearResetContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'nowrap',
  },
  clearResetTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
    flex: '1 1 auto',
  },
  searchInput: {
    flexGrow: 1,
    backgroundColor: palette.white,
    padding: '4px',
    borderRadius: '4px',
    border: `1px solid ${palette.grey}`,
    width: '100%',
    alignItems: 'center',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  secondaryPanelOptions: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
  },
};

function ChplFilterPanel({ filterGridMinColWidth }) {
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCategoryKey, setActiveCategoryKey] = useState('');
  const [filters, setFilters] = useState([]);
  const filterContext = useFilterContext();

  useEffect(() => {
    setFilters(filterContext.filters
      .sort((a, b) => (a.getFilterDisplay(a) < b.getFilterDisplay(b) ? -1 : 1))
      .filter((f) => f.values?.length > 0)
      .map((f) => ({
        ...f,
        values: f.values.sort((a, b) => f.sortValues(f, a, b)),
      })));
  }, [filterContext.filters]);

  useEffect(() => {
    setActiveCategory(filters.find((f) => f?.key === activeCategoryKey));
  }, [filters, activeCategoryKey]);

  const handleClick = (e) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: 'Open Advanced Search',
      });
    }
    setAnchor(e.currentTarget.closest('[data-filter-search-bar="true"]') || e.currentTarget);
    setPanelWidth((e.currentTarget.closest('[data-filter-search-bar="true"]') || e.currentTarget).getBoundingClientRect().width);
    setOpen(true);
  };

  const handleClose = () => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: 'Close Advanced Search',
      });
    }
    setOpen(false);
    setPanelWidth(null);
  };

  const handleAction = (action) => {
    filterContext.dispatch(action, activeCategory);
  };

  const handleCategoryToggle = (filter) => {
    if (activeCategory === filter) {
      setActiveCategoryKey('');
    } else {
      if (filterContext.analytics) {
        eventTrack({
          ...filterContext.analytics,
          event: 'Open Filter',
          label: filter.getFilterDisplay(filter),
        });
      }
      setActiveCategoryKey(filter.key);
    }
  };

  const handleFilterToggle = (value) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: 'Toggle Filter',
        label: activeCategory.getValueDisplay(value),
        aggregationName: activeCategory.display,
      });
    }
    filterContext.dispatch('toggle', activeCategory, value);
    filterContext.dispatch('hasSearched');
  };

  const handleFilterUpdate = (event, filter, value) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: 'Update Filter',
        label: activeCategory.getValueDisplay(value),
        aggregationName: activeCategory.display,
      });
    }
    filterContext.dispatch('update', filter, {
      ...value,
      selected: event.target.value,
    });
    filterContext.dispatch('hasSearched');
  };

  const toggleOperator = (f) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: `Set Any/All Filter to ${f.operator === 'and' ? 'Any' : 'All'}`,
        label: f.getFilterDisplay(f),
      });
    }
    filterContext.dispatch('toggleOperator', f);
  };

  const toggleDevelopersListingsCriteriaOption = (f) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: `Set Active/All Listings Filter to ${f.developersListingsCriteriaOption === 'active' ? 'Active Listings' : 'All Listings'}`,
        label: f.getFilterDisplay(f),
      });
    }
    filterContext.dispatch('toggleDevelopersListingsCriteriaOption', f);
  };

  return (
    <>
      <Button
        sx={styles.advancedSearchButton}
        variant="text"
        id="filter-panel-toggle"
        onClick={handleClick}
      >
        Filters
        {' '}
        <FilterListIcon sx={styles.iconSpacing} />
      </Button>
      <Popover
        id="filter-panel-form"
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        TransitionProps={{ onExited: () => { setAnchor(null); setActiveCategoryKey(''); } }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: panelWidth ? `${panelWidth - 284}px` : 'calc(100vw - 316px)',
            maxWidth: 'calc(100vw - 32px)',
            alignItems: 'center',
            borderRadius: '0 0 8px 8px',
            marginTop: '0px',
            border: `1px solid ${palette.grey}`,
            boxShadow: 'rgb(149 157 165 / 40%) 0px 6px 16px 6px',
            backgroundColor: palette.white,
          },
        }}
      >
        <Box sx={styles.filterPanelContainer}>
          <Box>
            <Box sx={styles.filterPanelPrimary}>
              <List
                dense
                subheader={(
                  <ListSubheader
                    disableSticky
                    component="div"
                    id="filter-panel-primary-subheader"
                  >
                    <Box sx={styles.filterHeaderContainer}>
                      <Typography variant="subtitle1"> Filter By: </Typography>
                      <ButtonGroup
                        variant="text"
                        color="primary"
                        size="medium"
                        aria-label="apply to filter dropdown"
                      >
                        <Button
                          onClick={() => handleAction('resetAll')}
                        >
                          Reset All Filters
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </ListSubheader>
                )}
              >
                <Box sx={styles.filterSubHeaderContainer}>
                  <Box sx={[styles.filterContainer, { gridTemplateColumns: `repeat(auto-fit, minmax(${filterGridMinColWidth}px, 1fr))` }]}>
                    { filters.map((f) => (
                      <Button
                        fullWidth
                        key={f.key}
                        color={f === activeCategory ? 'inherit' : 'primary'}
                        id={`filter-panel-primary-items-${f.key}`}
                        sx={{ whiteSpace: f.wrapText ? 'normal' : 'nowrap' }}
                        variant="outlined"
                        onClick={() => handleCategoryToggle(f)}
                      >
                        <Box component="span" sx={f === activeCategory ? styles.filterBold : undefined}>
                          {f.getFilterDisplay(f)}
                        </Box>
                      </Button>
                    ))}
                  </Box>
                </Box>
              </List>
            </Box>
          </Box>
          <Box sx={styles.filterPanelSecondary}>
            {!activeCategory && (
              <Box mt={2}>
                <Typography sx={styles.directionText} variant="subtitle1" gutterBottom>Select a filter to begin</Typography>
                <Typography variant="body1">To narrow down your search results, choose a filter category from the left-hand panel.</Typography>
                <Typography sx={{mt: 2}} variant="body1">Then, select one or more filter options to apply to your search.</Typography>
              </Box>
            )}
            { activeCategory?.values.length > 0 && (
              <List
                dense
                subheader={(
                  <ListSubheader
                    component="div"
                    id="filter-panel-secondary-subheader"
                    sx={styles.clearResetContainer}
                    disableGutters
                  >
                    <Typography variant="subtitle1" sx={styles.clearResetTitle}>
                      { activeCategory.getFilterDisplay(activeCategory) }
                    </Typography>
                    <Box sx={styles.secondaryPanelOptions}>
                      { activeCategory.operatorKey
                        && (
                          <FormControlLabel
                            control={(
                              <Switch
                                id={`${activeCategory.key}-operator-panel-toggle`}
                                color="primary"
                                checked={activeCategory.operator === 'and'}
                                onChange={() => toggleOperator(activeCategory)}
                              />
                            )}
                            label={activeCategory.operator === 'and' ? 'All' : 'Any'}
                          />
                        )}
                      { activeCategory.developersListingsCriteriaOptionKey
                        && (
                          <FormControlLabel
                            control={(
                              <Switch
                                id={`${activeCategory.key}-developers-listings-criteria-option-panel-toggle`}
                                color="primary"
                                checked={activeCategory.developersListingsCriteriaOption === 'all'}
                                onChange={() => toggleDevelopersListingsCriteriaOption(activeCategory)}
                              />
                            )}
                            label={activeCategory.developersListingsCriteriaOption === 'active' ? 'Active Listings' : 'All Listings'}
                          />
                        )}
                      <ButtonGroup
                        variant="text"
                        color="primary"
                        size="medium"
                        aria-label="apply to filter dropdown"
                      >
                        <Button
                          onClick={() => handleAction('clearFilter')}
                          disabled={activeCategory.required}
                        >
                          Clear
                        </Button>
                        <Button
                          onClick={() => handleAction('resetFilter')}
                        >
                          Reset
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </ListSubheader>
                )}
              >
                <Box sx={styles.filterGroupTwoContainer}>
                  { activeCategory.disabled
                    && (
                      <>
                        <Typography variant="body1" gutterBottom>
                          This information is temporarily unavailable. Please check back later.
                        </Typography>
                        <Typography variant="body1">
                          Surveillance and Direct Review information can be downloaded from the
                          {' '}
                          <a href="#/resources/download">Download the CHPL page</a>
                        </Typography>
                      </>
                    )}
                  { !activeCategory.disabled && activeCategory.getValueEntry({
                    filter: activeCategory,
                    handleFilterToggle,
                    handleFilterUpdate,
                  })}
                </Box>
              </List>
            )}
          </Box>
        </Box>
        <Box sx={styles.filterPanelFooter}>
          <Button
            color="primary"
            variant="outlined"
            id="filter-panel-close"
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default ChplFilterPanel;

ChplFilterPanel.propTypes = {
  filterGridMinColWidth: number.isRequired,
};
