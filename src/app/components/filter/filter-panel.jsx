import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  List,
  ListSubheader,
  Popover,
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
    background: '#fafdff',
    display: 'grid',
    gridTemplateColumns: '1fr',
    padding: '16px',
    rowGap: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  filterBold: {
    fontWeight: '600',
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto',
    justifyItems: 'start',
    alignItems: 'start',
    gap: '8px',
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
    borderLeft: '1px solid #599bde',
    paddingLeft: '16px',
  },
  filterSubHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    justifyItems: 'start',
    gap: '8px',
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
        values: f.values.sort((a, b) => (f.getValueDisplay(a) < f.getValueDisplay(b) ? -1 : 1)),
      })));
  }, [filterContext.filters]);

  useEffect(() => {
    setActiveCategory(filters.find((f) => f.key === activeCategoryKey));
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
            width: '95%',
            alignItems: 'center',
            borderRadius: '0 0 8px 8px',
            marginTop: '20px',
            border: `1px solid ${palette.grey}`,
            boxShadow: 'rgb(149 157 165 / 40%) 0px 6px 16px 6px',
          },
        }}
      >
        <div className={classes.filterPanelContainer}>
          <div>
            <div>
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
          <div>
            { activeCategory?.values.length > 0 && (
              <List
                dense
                subheader={(
                  <ListSubheader
                    disableSticky
                    component="div"
                    id="filter-panel-secondary-subheader"
                  >
                    <div className={classes.filterSubHeaderContainer}>
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
