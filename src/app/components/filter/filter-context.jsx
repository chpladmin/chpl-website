import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  arrayOf,
  bool,
  shape,
  string,
} from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';

const FilterContext = createContext();

const defaultFilter = {
  getQuery: (filter) => `${filter.key}=${filter.values.sort((a, b) => (a.value < b.value ? -1 : 1)).map((v) => v.value).join(',')}`,
  getFilterDisplay: (filter) => filter.display,
  getValueDisplay: (value) => value.display,
};

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

const toggleFilter = (filters, category, value, setFilters) => {
  const filter = filters.find((f) => f.key === category.key);
  const item = filter.values.find((v) => v.value === value.value);
  const updatedItem = {
    ...item,
    selected: !item.selected,
  };
  const updatedFilter = {
    ...filter,
    values: filter.values.filter((v) => v.value !== value.value).concat(updatedItem),
  };
  const updatedFilters = filters.filter((f) => f.key !== category.key).concat(updatedFilter);
  if (!filter.required || updatedFilter.values.reduce((has, v) => has || v.selected, false)) {
    setFilters(updatedFilters);
  }
};

const updateFilter = (filters, category, value, setFilters) => {
  const filter = filters.find((f) => f.key === category.key);
  const item = filter.values.find((v) => v.value === value.value);
  const updatedItem = {
    ...item,
    data: value.data,
  };
  const updatedFilter = {
    ...filter,
    values: filter.values.filter((v) => v.value !== value.value).concat(updatedItem),
  };
  const updatedFilters = filters.filter((f) => f.key !== category.key).concat(updatedFilter);
  if (!filter.required || updatedFilter.values.reduce((has, v) => has || v.selected, false)) {
    setFilters(updatedFilters);
  }
};

function FilterProvider(props) {
  const $analytics = getAngularService('$analytics');
  const {
    analytics,
  } = props;
  const [filters, setFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilters(props.filters.map((filter) => ({
      ...filter,
      required: !!filter.required,
      values: filter.values.map((value) => ({
        ...value,
        selected: !!value.default,
        default: !!value.default,
        display: value.display || value.value,
      })),
    })));
  }, [props.filters]); // eslint-disable-line react/destructuring-assignment

  const dispatch = (action, category, value) => {
    switch (action) {
      case 'clearFilter':
        if (analytics) {
          $analytics.eventTrack('Clear Filter', { category: analytics.category, label: category.display });
        }
        clearFilter(filters.find((f) => f.key === category.key), category, setFilters);
        break;
      case 'resetFilter':
        if (analytics) {
          $analytics.eventTrack('Reset Filter', { category: analytics.category, label: category.display });
        }
        resetFilter(filters.find((f) => f.key === category.key), category, setFilters);
        break;
      case 'resetAll':
        if (analytics) {
          $analytics.eventTrack('Reset All Filters', { category: analytics.category });
        }
        setFilters(filters.map((f) => ({
          ...f,
          values: f.values.map((v) => ({
            ...v,
            selected: v.default,
          })),
        })));
        break;
      case 'toggle':
        toggleFilter(filters, category, value, setFilters);
        break;
      case 'update':
        updateFilter(filters, category, value, setFilters);
        break;
      default:
        console.log({ action, category, value });
    }
  };

  const queryString = () => filters
    .concat({
      key: 'searchTerm',
      values: [{ value: searchTerm, selected: searchTerm }],
    })
    .map((f) => ({
      ...f,
      values: f.values.filter((v) => v.selected),
    }))
    .filter((f) => f.values.length > 0)
    .sort((a, b) => (a.key < b.key ? -1 : 1))
    .map((f) => f.getQuery(f))
    .join('&');

  const filterData = {
    analytics, dispatch, filters, queryString, searchTerm, setSearchTerm,
  };

  /* eslint-disable react/jsx-props-no-spreading */
  return <FilterContext.Provider value={filterData} {...props} />;
  /* eslint-enable react/jsx-props-no-spreading */
}

FilterProvider.propTypes = {
  filters: arrayOf(shape({
    key: string.isRequired,
    display: string.isRequired,
    required: bool,
    values: arrayOf(shape({
      value: string.isRequired,
      default: bool,
      display: string,
    })).isRequired,
  })).isRequired,
  analytics: shape({
    category: string.isRequired,
  }),
};

FilterProvider.defaultProps = {
  analytics: false,
};

function useFilterContext() {
  return useContext(FilterContext);
}

export { FilterProvider, defaultFilter, useFilterContext };
