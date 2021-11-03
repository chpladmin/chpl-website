import React, { createContext, useContext, useEffect, useState } from 'react';
import { arrayOf, object } from 'prop-types';

const FilterContext = createContext();

const clearFilter = (filter, category, setFilters) => {
  setFilters((filters) => filters.filter((f) => f.key !== category.key).concat({
    ...filter,
    values: filter.values.map((v) => ({
      ...v,
      selected: false,
    })),
  }));
};

const resetFilter = (filter, category, setFilters) => {
  setFilters((filters) => filters.filter((f) => f.key !== category.key).concat({
    ...filter,
    values: filter.values.map((v) => ({
      ...v,
      selected: v.default,
    })),
  }));
};

function FilterProvider(props) {
  const [filters, setFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilters(props.filters.map((filter) => ({
      ...filter,
      values: filter.values.map((value) => ({
        ...value,
        selected: !!value.default,
        default: !!value.default,
      }))
    })));
  }, [props.filters]);

  const dispatch = (action, category, value) => {
    switch (action) {
      case 'clearFilter':
        clearFilter(filters.find((f) => f.key === category.key), category, setFilters);
        break;
      case 'resetFilter':
        resetFilter(filters.find((f) => f.key === category.key), category, setFilters);
        break;
      case 'resetAll':
        setFilters(filters.map((f) => ({
          ...f,
          values: f.values.map((v) => ({
            ...v,
            selected: v.default,
          })),
        })));
        break;
      case 'toggle':
        const filter = filters.find((f) => f.key === category.key);
        const item = filter.values.find((v) => v.value === value.value);
        const updatedItem = {
          ...item,
          selected: !item.selected,
        };
        const updatedFilter = {
          ...filter,
          values: filter.values.filter((v) => v.value !== value.value).concat(updatedItem),
        }
        const updatedFilters = filters.filter((f) => f.key !== category.key).concat(updatedFilter);
        setFilters(updatedFilters);
        break;
      default:
        console.log({action, category, value});
    }
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

FilterProvider.propTypes = {
  filters: arrayOf(object).isRequired,
};

function useFilterContext() {
  return useContext(FilterContext);
}

export { FilterProvider, useFilterContext };
