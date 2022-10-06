import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import Moment from 'react-moment';
import {
  arrayOf,
  bool,
  func,
  oneOfType,
  shape,
  string,
} from 'prop-types';

import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { useSessionStorage as useStorage } from 'services/storage.service';

const FilterContext = createContext();

const getDefaultValueEntry = ({ filter, handleFilterToggle }) => filter.values
  .map((value) => {
    const labelId = `filter-panel-secondary-items-${value.value.replace(/ /g, '_')}`;
    return (
      <ListItem
        key={value.value}
        button
        onClick={() => handleFilterToggle(value)}
        disabled={filter.required && value.selected && filter.values.filter((a) => a.selected).length === 1}
      >
        <ListItemIcon>
          <Checkbox
            color="primary"
            edge="start"
            checked={value?.selected || false}
            tabIndex={-1}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId}>{filter.getValueDisplay(value)}</ListItemText>
      </ListItem>
    );
  });

const getDateDisplay = (value) => (
  <>
    {value.value}
    :
    {' '}
    { value.selected
      ? (
        <Moment
          fromNow
          withTitle
          titleFormat="DD MMM yyyy"
        >
          {value.selected}
        </Moment>
      ) : (
        <>
          No date selected
        </>
      )}
  </>
);

const generateDateEntry = ({ filter, handleFilterUpdate, type }) => filter.values
  .sort((a, b) => (a.value > b.value ? -1 : 1))
  .map((value) => {
    const labelId = `filter-panel-secondary-items-${value.value.replace(/ /g, '_')}`;
    return (
      <React.Fragment key={value.value}>
        <div>
          {filter.getValueDisplay(value)}
        </div>
        <ChplTextField
          id={labelId}
          type={type}
          value={value.selected}
          onChange={(event) => handleFilterUpdate(event, filter, value)}
        />
      </React.Fragment>
    );
  });

const getDateTimeEntry = ({ filter, handleFilterUpdate }) => generateDateEntry({ filter, handleFilterUpdate, type: 'datetime-local' });

const getDateEntry = ({ filter, handleFilterUpdate }) => generateDateEntry({ filter, handleFilterUpdate, type: 'date' });

const defaultFilter = {
  getQuery: (filter) => `${filter.key}=${filter.values.sort((a, b) => (a.value < b.value ? -1 : 1)).map((v) => v.value).join(',')}`,
  getFilterDisplay: (filter) => filter.display,
  getValueDisplay: (value) => value.display,
  getValueEntry: getDefaultValueEntry,
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
    selected: value.selected,
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
    analytics, storageKey,
  } = props;
  const [filters, setFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useStorage(`${storageKey}-searchTerm`, '');
  const [values, setValues] = useStorage(`${storageKey}-values`, {});

  useEffect(() => {
    setFilters(props.filters.map((filter) => ({
      ...filter,
      required: !!filter.required,
      values: values[filter.key] ? values[filter.key] : filter.values.map((value) => ({
        ...value,
        selected: value.default,
        default: value.default,
        display: value.display || value.value,
      })),
    })));
  }, [props.filters]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setValues(filters.reduce((v, filter) => ({
      ...v,
      [filter.key]: filter.values,
    }), {}));
  }, [filters]);
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

  const queryParams = () => filters
    .concat({
      ...defaultFilter,
      key: 'searchTerm',
      values: [{ value: searchTerm, selected: searchTerm }],
    })
    .map((f) => ({
      ...f,
      values: f.values.filter((v) => v.selected),
    }))
    .filter((f) => f.values.length > 0)
    .flatMap((f) => f.getQuery(f).split('&'))
    .reduce((params, f) => {
      const [key, value] = f.split('=');
      return {
        ...params,
        [key]: value,
      };
    }, {});

  const queryString = () => filters
    .concat({
      ...defaultFilter,
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
    analytics, dispatch, filters, queryParams, queryString, searchTerm, setSearchTerm,
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
      default: oneOfType([bool, string]),
      display: string,
    })).isRequired,
    getQuery: func,
    getValueDisplay: func,
    getValueEntry: func,
  })).isRequired,
  analytics: shape({
    category: string.isRequired,
  }),
  storageKey: string,
};

FilterProvider.defaultProps = {
  analytics: false,
  storageKey: 'default',
};

function useFilterContext() {
  return useContext(FilterContext);
}

export {
  FilterProvider, defaultFilter, getDateDisplay, getDateEntry, getDateTimeEntry, useFilterContext,
};
