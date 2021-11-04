import React, { useEffect, useState } from 'react';
import {
  Chip, Typography,makeStyles,
} from '@material-ui/core';

import { useFilterContext } from './filter-context';
const useStyles = makeStyles(() => ({
  filterSelectedContainer: {
   display:'flex',
   gap:'4px',
   alignItems:'center',
   justifyContent:'flex-start',
   flexWrap:'wrap',
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
    <>
      { filters.map((f) => (
        <span className={classes.filterSelectedContainer} key={f.key}>
          <Typography variant='body1'><strong>{f.display}:</strong></Typography>
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
    </>
  );
}

export default ChplFilterChips;

ChplFilterChips.propTypes = {
};
