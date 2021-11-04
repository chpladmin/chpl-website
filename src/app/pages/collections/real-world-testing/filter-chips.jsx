import React, { useEffect, useState } from 'react';
import {
  Chip,
} from '@material-ui/core';

import { useFilterContext } from './filter-context';

function ChplFilterChips() {
  const [filters, setFilters] = useState([]);
  const filterContext = useFilterContext();

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
        <span key={f.key}>
          { f.values
            .map((v) => (
              <Chip
                key={v.value}
                label={`${f.display}: ${v.display}`}
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
