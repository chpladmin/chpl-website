import React, { useContext } from 'react';
import {
  Chip,
} from '@material-ui/core';
import { useFilterContext } from './filter-context';

function ChplFilterChips() {
  const filterContext = useFilterContext();

  return (
    <>
      Chips:
      { filterContext?.filters?.map((f) => (
        <span key={f.key}>
          { f.values?.map((v) => (
            <Chip
              key={v}
              label={`${f.key}: ${v}`}
              onDelete={() => filterContext.dispatch('delete', f, v)}
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
