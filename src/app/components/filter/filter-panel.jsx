import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Typography,
  makeStyles,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';

import { useFilterContext } from './filter-context';

import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import theme from 'themes/theme';

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
      gridTemplateColumns: '1fr 1fr 1fr',
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
    border: '1px solid #C6D5E5',
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
  const [activeValue, setActiveValue] = useState(null);
  const [activeCategoryKey, setActiveCategoryKey] = useState('');
  const [activeValueKey, setActiveValueKey] = useState('');
  const [filters, setFilters] = useState([]);
  const filterContext = useFilterContext();

  useEffect(() => {
    setFilters(filterContext.filters
      .sort((a, b) => (a.display < b.display ? -1 : 1))
      .map((f) => ({
        ...f,
        values: f.values.sort((a, b) => (a.display < b.display ? -1 : 1)),
      })));
  }, [filterContext.filters]);

  useEffect(() => {
    setActiveCategory(filters.find((f) => f.key === activeCategoryKey));
  }, [filters, activeCategoryKey]);

  useEffect(() => {
    if (activeCategory?.values) {
      setActiveValue(activeCategory.values.find((v) => v.value === activeValueKey));
    }
  }, [filters, activeCategory, activeValueKey]);

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
    setActiveValueKey('');
  };

  const handleAction = (action) => {
    filterContext.dispatch(action, activeCategory);
  };

  const handleCategoryToggle = (filter) => {
    if (activeCategory === filter) {
      setActiveCategoryKey('');
    } else {
      if (filterContext.analytics) {
        $analytics.eventTrack('Select Filter Category', { category: filterContext.analytics.category, label: `${filter.display}` });
      }
      setActiveCategoryKey(filter.key);
    }
  };

  const handleSecondaryToggle = (value) => {
    if (filterContext.analytics) {
      $analytics.eventTrack('Toggle Filter', { category: filterContext.analytics.category, label: `${activeCategory.display}: ${value.display}` });
    }
    filterContext.dispatch('toggle', activeCategory, value);
  };

  const handleTertiaryValueToggle = (value) => {
    if (activeValue === value) {
      setActiveValueKey('');
      setActiveValue(null);
    } else {
      setActiveValueKey(value.value);
      setActiveValue(value);
    }
  };

  const handleTertiaryToggle = (event) => {
    filterContext.dispatch('toggle', activeCategory, {
      ...activeValue,
      selected: event.target.checked,
    });
  };

  const handleTertiaryUpdate = (event) => {
    filterContext.dispatch('update', activeCategory, {
      ...activeValue,
      data: {
        date: event.target.value,
      },
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
            height: '250px',
            background: '#E7F0F8',
            display: 'grid',
            width: '100%',
            marginTop: '20px',
            borderRadius: '0px',
            boxShadow: '0px 4px 8px rgb(149 157 165 / 30%)',
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
                          {f.display}
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
                  { activeCategory.values.map((v) => {
                    const labelId = `filter-panel-secondary-items-${v.value.replace(/ /g, '_')}`;
                    if (v.data) {
                      return (
                        <Button
                          key={v.value}
                          onClick={() => handleTertiaryValueToggle(v)}
                        >
                          {v.display}
                        </Button>
                      );
                    }
                    return (
                      <ListItem
                        key={v.value}
                        button
                        onClick={() => handleSecondaryToggle(v)}
                        disabled={activeCategory.required && v.selected && activeCategory.values.filter((a) => a.selected).length === 1}
                      >
                        <ListItemIcon>
                          <Checkbox
                            color="primary"
                            edge="start"
                            checked={v.selected}
                            tabIndex={-1}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText id={labelId}>{v.display}</ListItemText>
                      </ListItem>
                    );
                  })}
                </div>
              </List>
            )}
          </div>
          { activeValue
            && (
              <div className={classes.filterGroupThreeContainer}>
                { activeCategory.getDisplay ? activeCategory.getDisplay(activeValue) : activeValue.display }
                <Checkbox
                  checked={activeValue.selected}
                  onChange={handleTertiaryToggle}
                />
                <ChplTextField
                  type="datetime-local"
                  value={activeValue.data.date}
                  onChange={handleTertiaryUpdate}
                />
              </div>
            )}
        </div>
      </Popover>
    </>
  );
}

export default ChplFilterPanel;

ChplFilterPanel.propTypes = {
};
