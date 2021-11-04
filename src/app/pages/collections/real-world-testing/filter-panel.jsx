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
import theme from '../../../themes/theme';

const useStyles = makeStyles({
  filterPanelContainer: {
    background: '#fafdff',
    display: 'grid',
    gridTemplateColumns: '1fr',
    padding: '16px',
    rowGap:'16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  filterBold:{
    fontWeight:'600',
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto',
    justifyItems: 'start',
    alignItems: 'start',
    gap:'8px',
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
  const classes = useStyles();
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [activeKey, setActiveKey] = useState('');
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
    setActive(filters.find((f) => f.key === activeKey));
  }, [filters, activeKey]);

  const handleClick = (e) => {
    setAnchor(e.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchor(null);
    setOpen(false);
    setActiveKey('');
  };

  const handleSecondaryToggle = (value) => {
    filterContext.dispatch('toggle', active, value);
  };

  const handleAction = (action) => {
    filterContext.dispatch(action, active);
  };

  const toggleActive = (filter) => {
    if (active === filter) {
      setActiveKey('');
    } else {
      setActiveKey(filter.key);
    }
  };

  return (
    <>
      <Button
        color="primary"
        id="filter-panel-toggle"
        aria-describedby="filter-panel-form"
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
                        color={f === active ? 'default' : 'primary'}
                        id={`filter-panel-primary-items-${f.key}`}
                        variant='outlined'
                        onClick={() => toggleActive(f)}
                      >
                        <span className={f === active ? classes.filterBold : undefined}>
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
            { active?.values.length > 0 && (
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
                  { active.values.map((v) => {
                    const labelId = `filter-panel-secondary-items-${v.value.replaceAll(' ', '_')}`;
                    return (
                      <ListItem
                        key={v.value}
                        button
                        onClick={() => handleSecondaryToggle(v)}
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
        </div>
      </Popover>
    </>
  );
}

export default ChplFilterPanel;

ChplFilterPanel.propTypes = {
};
