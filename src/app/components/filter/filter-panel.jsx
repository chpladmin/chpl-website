import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  FormControlLabel,
  List,
  ListSubheader,
  Popover,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';

import { useFilterContext } from './filter-context';

import { getAngularService } from 'services/angular-react-helper';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  advancedSearchButton: {
    color: '#000',
  },
  filterPanelContainer: {
    background: '#fff',
    display: 'grid',
    gridTemplateColumns: '1fr',
    rowGap: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  filterPanelPrimary: {
    padding: '16px',
  },
  filterPanelSecondary: {
    borderLeft: '1px solid #599bde',
    padding: '16px',
  },
  filterBold: {
    fontWeight: '600',
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(225px, 1fr))',
    justifyItems: 'start',
    alignItems: 'start',
    gap: '16px',
    padding: '0 8px',
    marginTop: '16px',
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    },
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
  },
  searchInput: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
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
});

function ChplFilterPanel() {
  const $analytics = getAngularService('$analytics');
  const classes = useStyles();
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCategoryKey, setActiveCategoryKey] = useState('');
  const [filters, setFilters] = useState([]);
  const filterContext = useFilterContext();

  useEffect(() => {
    setFilters(filterContext.filters
      .sort((a, b) => (a.getFilterDisplay(a) < b.getFilterDisplay(b) ? -1 : 1))
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
      $analytics.eventTrack('Open Advanced Search', { category: filterContext.analytics.category });
    }
    setAnchor(e.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchor(null);
    setOpen(false);
    setActiveCategoryKey('');
  };

  const handleAction = (action) => {
    filterContext.dispatch(action, activeCategory);
  };

  const handleCategoryToggle = (filter) => {
    if (activeCategory === filter) {
      setActiveCategoryKey('');
    } else {
      if (filterContext.analytics) {
        $analytics.eventTrack('Select Filter Category', { category: filterContext.analytics.category, label: `${filter.getFilterDisplay(filter)}` });
      }
      setActiveCategoryKey(filter.key);
    }
  };

  const handleFilterToggle = (value) => {
    if (filterContext.analytics) {
      $analytics.eventTrack('Toggle Filter', { category: filterContext.analytics.category, label: `${activeCategory.display}: ${activeCategory.getValueDisplay(value)}` });
    }
    filterContext.dispatch('toggle', activeCategory, value);
  };

  const handleFilterUpdate = (event, filter, value) => {
    filterContext.dispatch('update', filter, {
      ...value,
      selected: event.target.value,
    });
  };

  const toggleOperator = (f) => {
    if (filterContext.analytics) {
      $analytics.eventTrack('Toggle Operator', { category: filterContext.analytics.category, label: `${f.getFilterDisplay(f)}: ${f.operator === 'and' ? 'All' : 'Any'}` });
    }
    filterContext.dispatch('toggleOperator', f);
  };

  return (
    <>
      <Button
        className={classes.advancedSearchButton}
        variant="text"
        id="filter-panel-toggle"
        onClick={handleClick}
      >
        Advanced Search
        {' ' }
        <FilterListIcon className={classes.iconSpacing} />
      </Button>
      <Popover
        id="filter-panel-form"
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            width: '93%',
            alignItems: 'center',
            borderRadius: '0 0 8px 8px',
            marginTop: '20px',
            marginLeft: '32px',
            border: `1px solid ${palette.grey}`,
            boxShadow: 'rgb(149 157 165 / 40%) 0px 6px 16px 6px',
            backgroundColor: '#fff',
          },
        }}
      >
        <div className={classes.filterPanelContainer}>
          <div>
            <div className={classes.filterPanelPrimary}>
              <List
                dense
                subheader={(
                  <ListSubheader
                    disableSticky
                    component="div"
                    id="filter-panel-primary-subheader"
                  >
                    <div className={classes.filterHeaderContainer}>
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
                    </div>
                  </ListSubheader>
                )}
              >
                <div className={classes.filterSubHeaderContainer}>
                  <div className={classes.filterContainer}>
                    { filters.map((f) => (
                      <Button
                        fullWidth
                        key={f.key}
                        color={f === activeCategory ? 'default' : 'primary'}
                        id={`filter-panel-primary-items-${f.key}`}
                        variant="outlined"
                        onClick={() => handleCategoryToggle(f)}
                      >
                        <span className={f === activeCategory ? classes.filterBold : undefined}>
                          {f.getFilterDisplay(f)}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </List>
            </div>
          </div>
          <div className={classes.filterPanelSecondary}>
            { activeCategory?.values.length > 0 && (
              <List
                dense
                subheader={(
                  <ListSubheader
                    component="div"
                    id="filter-panel-secondary-subheader"
                    className={classes.clearResetContainer}
                    disableGutters
                  >
                    <Typography variant="subtitle1">
                      { activeCategory.getFilterDisplay(activeCategory) }
                    </Typography>
                    <div className={classes.secondaryPanelOptions}>
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
                    </div>
                  </ListSubheader>
                )}
              >
                <div className={classes.filterGroupTwoContainer}>
                  { activeCategory.getValueEntry({
                    filter: activeCategory,
                    handleFilterToggle,
                    handleFilterUpdate,
                  })}
                </div>
              </List>
            )}
          </div>
        </div>
      </Popover>
    </>
  );
}

export default ChplFilterPanel;

ChplFilterPanel.propTypes = {
};
