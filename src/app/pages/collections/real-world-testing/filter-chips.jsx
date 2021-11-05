import React, { useEffect, useState } from 'react';
import {
  Typography,
  Chip,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../themes/theme';

import { useFilterContext } from './filter-context';

const useStyles = makeStyles(() => ({
  filterContainer: {
    display: 'flex',
    padding: '16px 32px',
    gap: '8px',
    backgroundColor: '#fafdff',
    borderBottom: '1px solid #bbb',
    boxShadow: 'rgba(149, 157, 165, 0.1) 8px 0 8px',
    flexWrap: 'wrap',
    flexFlow: 'column',
    [theme.breakpoints.up('md')]: {
      flexFlow: 'row',
      flexWrap: 'wrap',
    },
  },
  filterApplied: {
    paddingTop: '4px',
  },
  filterSelectedContainer: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
}));

function ChplFilterChips() {
  const [filters, setFilters] = useState([]);
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setFilters(filterContext.filters
      .sort((a, b) => (a.display < b.display ? -1 : 1))
      .map((filter) => ({
        ...filter,
        values: filter.values
          .filter((f) => f.selected)
          .sort((a, b) => (a.display < b.display ? -1 : 1)),
      }))
      .filter((filter) => filter.values.length > 0));
  }, [filterContext.filters]);

  return (
    <span className={classes.filterContainer} id="filter-chips">
      <Typography className={classes.filterApplied} variant="subtitle1">Filters Applied:</Typography>
      { filters.map((f) => (
        <span
          className={classes.filterSelectedContainer}
          key={f.key}
        >
          <Typography variant="body1">
            <strong>
              {f.display}
              :
            </strong>
          </Typography>
          {f.values
            .map((v) => (
              <Chip
                key={v.value}
                label={`${v.display}`}
                onDelete={() => filterContext.dispatch('toggle', f, v)}
                color="primary"
                variant="outlined"
              />
            ))}
        </span>
      ))}
    </span>
  );
}

export default ChplFilterChips;

ChplFilterChips.propTypes = {
};
