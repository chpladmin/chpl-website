import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

function FilterProvider(props) {
  const [filters, setFilters] = useState(props.filters);

  const dispatch = (action, category, value) => {
    switch (action) {
      case 'delete':
        const filter = filters.find((f) => f.key === category.key);
        const updatedFilter = {
          ...filter,
          values: filter.values.filter((v) => v !== value),
        }
        const updated = filters.filter((f) => f.key !== category.key).concat(updatedFilter);
        setFilters(updated);
        break;
      default:
        console.log({action, category, value});
    }
  };

  const queryString = () => filters
        .filter((f) => f.values.length > 0)
        .map((f) => `${f.key}=${f.values.join(',')}`)
        .join('&');

  const filterData = { dispatch, filters, queryString };

  return <FilterContext.Provider value={filterData} {...props} />;
}

function useFilterContext() {
  return useContext(FilterContext);
}

export { FilterContext, FilterProvider, useFilterContext };
