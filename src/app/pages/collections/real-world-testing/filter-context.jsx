import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

function FilterProvider(props) {
  const [filters, setFilters] = useState(props.filters);
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = (action, category, value) => {
    const filter = filters.find((f) => f.key === category.key);
    let updatedFilter, updatedFilters;
    switch (action) {
      case 'clearFilter':
        updatedFilter = {
          ...filter,
          values: filter.values.map((v) => ({
            ...v,
            selected: false,
          })),
        };
        break;
      case 'resetFilter':
        updatedFilter = {
          ...filter,
          values: filter.values.map((v) => ({
            ...v,
            selected: v.default,
          })),
        };
        break;
      case 'toggle':
        const item = filter.values.find((v) => v.value === value.value);
        const updatedItem = {
          ...item,
          selected: !item.selected,
        };
        updatedFilter = {
          ...filter,
          values: filter.values.filter((v) => v.value !== value.value).concat(updatedItem),
        }
        break;
      default:
        console.log({action, category, value});
    }
    updatedFilters = filters.filter((f) => f.key !== category.key).concat(updatedFilter);
    setFilters(updatedFilters);
  };

  const queryString = () => filters
        .concat({
          key: 'searchTerm',
          values: [{value: searchTerm, selected: searchTerm}],
        })
        .map((f) => ({
          ...f,
          values: f.values.filter((v) => v.selected),
        }))
        .filter((f) => f.values.length > 0)
        .sort((a, b) => a.key < b.key ? -1 : 1)
        .map((f) => `${f.key}=${f.values.sort((a, b) => a.value < b.value ? -1 : 1).map((v) => v.value).join(',')}`)
        .join('&');

  const filterData = { dispatch, filters, queryString, setSearchTerm };

  return <FilterContext.Provider value={filterData} {...props} />;
}

function useFilterContext() {
  return useContext(FilterContext);
}

export { FilterContext, FilterProvider, useFilterContext };
