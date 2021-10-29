import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

function FilterProvider(props) {
  const [filters, setFilters] = useState(props.filters);

  const dispatch = (action, category, value) => {
    console.log({action, category, value});
  };

  const queryString = () => filters.map((f) => `${f.key}=${f.values.join(',')}`).join('&');

  const filterData = { dispatch, filters, queryString };

  return <FilterContext.Provider value={filterData} {...props} />;
}

function useFilterContext() {
  return useContext(FilterContext);
}

export { FilterContext, FilterProvider, useFilterContext };
