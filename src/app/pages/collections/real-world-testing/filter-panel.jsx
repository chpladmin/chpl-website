import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Checkbox,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';

import { useFilterContext } from './filter-context';

const useStyles = makeStyles({
  filterPanelContainer: {
    background: '#E7F0F8',
    display: 'grid',
    gridTemplateColumns: '6fr 2fr 4fr',
    padding: '16px',
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto',
    justifyItems: 'start',
    alignItems: 'start',
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
  filterGroupThreeContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
  },
  filterSubHeaderGroupThreeContainer: {
    display: 'grid',
    gridTemplateColumns: '10fr auto auto',
    alignItems: 'center',
    gap: '8px',
  },
  filterSubHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
  switchGroupThreeContainer: {
    display: 'grid',
    gridTemplateColumns: '10fr auto auto',
    alignItems: 'center',
    gap: '4px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplFilterPanel(props) {
  const classes = useStyles();
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [activeKey, setActiveKey] = useState('');
  const [filters, setFilters] = useState([]);
  const filterContext = useFilterContext();

  useEffect(() => {
    setFilters(filterContext.filters
               .sort((a, b) => a.key < b.key ? -1 : 1)
               .map((f) => ({
                 ...f,
                 values: f.values.sort((a, b) => a.value < b.value ? -1 : 1),
               }))
              );
  }, [filterContext.filters]);

  useEffect(() => {
    setActive(filters.find((f) => f.key === activeKey));
  }, [filters, activeKey]);

  const handleClick = (e) => {
    setAnchor(e.currentTarget);
    setOpen(true);
  }

  const handleClose = () => {
    setAnchor(null);
    setOpen(false);
    setActiveKey('');
  };

  const handleSecondaryToggle = (value) => {
    filterContext.dispatch('toggle', active, value);
  };

  const handleAction = (action) => {
    filterContext.dispatch(action, active)
  }

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
            marginTop: '21px',
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
                subheader={
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
                        aria-label="apply to filter dropdown">
                        <Button
                          onClick={() => handleAction('resetAll')}
                        >
                          Reset All Filters
                        </Button>
                      </ButtonGroup>
                    </div>
                  </ListSubheader>
                }>
                <div className={classes.filterSubHeaderContainer}>
                  <div className={classes.filterContainer}>
                    { filters.map((f) => (
                      <Button
                        key={f.key}
                        color="primary"
                        variant={f === active ? 'outlined' : 'text'}
                        onClick={() => toggleActive(f)}
                      >
                        {f.display}
                      </Button>
                    ))}
                  </div>
                </div>
              </List>
            </div>
          </div>
          <div>
            <List
              dense
              subheader={
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
                      aria-label="apply to filter dropdown">
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
              }>
              { active?.values.length > 0 && (
                <div className={classes.filterGroupTwoContainer}>
                  { active.values.map((v) => {
                    const labelId = `filter-panel-secondary-items-${v.value}`;
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
                        <ListItemText id={labelId}>{v.value}</ListItemText>
                      </ListItem>
                    );
                  })}
                </div>
              )}
            </List>
          </div>
          <div>
            <List
              dense
              subheader={
                <ListSubheader
                  disableSticky
                  component="div"
                  id="filter-panel-tertiary-subheader"
                >
                  <div className={classes.filterSubHeaderGroupThreeContainer}>
                    <div className={classes.searchInput}>
                      <SearchIcon />
                      <InputBase
                        placeholder="Search for something..."
                      />
                    </div>
                    <Typography variant="subtitle1"> Matching: </Typography>
                    <div className={classes.switchGroupThreeContainer}>
                      <Typography variant="body1"> Any </Typography>
                      <Switch color="primary" />
                      <Typography variant="body1"> All </Typography>
                    </div>
                  </div>
                </ListSubheader>
              }>
              <div className={classes.filterGroupThreeContainer}>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>All</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>170.315 (a)(1): Computerized Provider Order Entry (CPOE) - Medications</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>170.315 (a)(3): CPOE - Diagnostic Imaging</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>170.315 (a)(5): Demographics</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>170.302 (a)(5): Demographics</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>170.302 (a)(6): Problem list</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>170.302 (a)(7): Medication list</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>170.302 (a)(8): Medication allergy list</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>170.302 (a)(9): Clinical decision support</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>170.302 (a)(10): Drug-formulary and preferred drug list checks</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>170.302 (a)(11): Smoking status</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox color="primary" edge="start" />
                  <ListItemText>170.302 (a)(12): Family health history</ListItemText>
                </ListItem>
              </div>
            </List>
          </div>
        </div>
      </Popover>
    </>
  );
}

export default ChplFilterPanel;

ChplFilterPanel.propTypes = {
};
