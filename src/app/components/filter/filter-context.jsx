import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { arrayOf, string } from 'prop-types';

import { getDefaultValueEntry, getDateEntry, getDateTimeEntry } from './filters/value-entries';

import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { filter as filterPropType, analyticsConfig } from 'shared/prop-types';

const FilterContext = createContext();

const getDateDisplay = (value) => (
  <>
    {value.value}
    :
    {' '}
    { value.selected
      ? (
        <>
          { getDisplayDateFormat(value.selected) }
        </>
      ) : (
        <>
          No date selected
        </>
      )}
  </>
);

const defaultFilter = {
  getQuery: (filter) => `${filter.key}=${filter.values.sort((a, b) => (a.value < b.value ? -1 : 1)).map((v) => v.value).join(',')}${filter.operatorKey ? `&${filter.operatorKey}=${filter.operator}` : ''}`,
  getFilterDisplay: (filter) => filter.display,
  getValueDisplay: (value) => value.display,
  getLongValueDisplay: (value) => value.longDisplay || value.display,
  getValueEntry: getDefaultValueEntry,
  sortValues: (filter, a, b) => (filter.getValueDisplay(a) < filter.getValueDisplay(b) ? -1 : 1),
  singular: false,
  disabled: false,
};

const clearFilter = (filter, category, setFilters) => {
  setFilters((filters) => filters.filter((f) => f.key !== category.key).concat({
    ...filter,
    operator: filter.operatorKey ? 'or' : undefined,
    values: filter.values.map((v) => ({
      ...v,
      selected: false,
    })),
  }));
};

const resetFilter = (filter, category, setFilters) => {
  setFilters((filters) => filters.filter((f) => f.key !== category.key).concat({
    ...filter,
    operator: filter.operatorKey ? 'or' : undefined,
    values: filter.values.map((v) => ({
      ...v,
      selected: v.default,
    })),
  }));
};

const setFilterDisability = (filters, category, disabled, setFilters) => {
  const filter = filters.find((f) => f.key === category);
  const updatedFilter = {
    ...filter,
    disabled,
  };
  setFilters((previous) => previous.filter((f) => f.key !== category).concat(updatedFilter));
};

const toggleFilter = (category, value, setFilters) => {
  setFilters((prev) => {
    const filter = prev.find((f) => f.key === category.key);
    const item = filter.values.find((v) => v.value === value.value);
    const updatedItem = {
      ...item,
      selected: !item.selected,
    };
    const updatedFilter = {
      ...filter,
      values: filter.values.filter((v) => v.value !== value.value).concat(updatedItem),
    };
    const updatedFilters = prev.filter((f) => f.key !== category.key).concat(updatedFilter);
    if (!filter.required || updatedFilter.values.reduce((has, v) => has || v.selected, false)) {
      return updatedFilters;
    }
    return prev;
  });
};

const toggleFilterOperator = (category, setFilters) => {
  setFilters((prev) => {
    const filter = prev.find((f) => f.key === category.key);
    const updatedFilter = {
      ...filter,
      operator: filter.operator === 'or' ? 'and' : 'or',
    };
    return prev.filter((f) => f.key !== category.key).concat(updatedFilter);
  });
};

const toggleShowAll = (filters, category, setFilters) => {
  const filter = filters.find((f) => f.key === category.key);
  const updatedFilter = {
    ...filter,
    showAll: !filter.showAll,
  };
  const updatedFilters = filters.filter((f) => f.key !== category.key).concat(updatedFilter);
  setFilters(updatedFilters);
};

const updateFilter = (category, value, setFilters, setSearchTerm) => {
  setFilters((prev) => {
    const filter = prev.find((f) => f.key === category.key);
    if (filter.singular) {
      const values = filter.values.map((v) => ({
        ...v,
        selected: v.value === value.value,
      }));
      const updatedFilter = {
        ...filter,
        values,
      };
      let updatedFilters;
      if (filter.loneFilter) {
        updatedFilters = prev.map((f) => ({
          ...f,
          operator: f.operatorKey ? 'or' : undefined,
          values: f.values.map((v) => ({
            ...v,
            selected: false,
          })),
        })).filter((f) => f.key !== category.key).concat(updatedFilter);
        setSearchTerm('');
      } else {
        updatedFilters = prev.filter((f) => f.key !== category.key).concat(updatedFilter);
      }
      if (!filter.required || updatedFilter.values.reduce((has, v) => has || v.selected, false)) {
        return updatedFilters;
      }
    } else {
      const item = filter.values.find((v) => v.value === value.value);
      const updatedItem = {
        ...item,
        selected: value.selected,
      };
      const updatedFilter = {
        ...filter,
        values: filter.values.filter((v) => v.value !== value.value).concat(updatedItem),
      };
      const updatedFilters = prev.filter((f) => f.key !== category.key).concat(updatedFilter);
      if (!filter.required || updatedFilter.values.reduce((has, v) => has || v.selected, false)) {
        return updatedFilters;
      }
    }
    return prev;
  });
};

function FilterProvider(props) {
  const {
    analytics, storageKey,
  } = props;
  const [filters, setFilters] = useState([]);
  const [hasSearched, setHasSearched] = useStorage(`${storageKey}-hasSearched`, false);
  const [operators, setOperators] = useStorage(`${storageKey}-operators`, {});
  const [searchTerm, setSearchTerm] = useState('');
  const [storedSearchTerm, setStoredSearchTerm] = useStorage(`${storageKey}-searchTerm`, '');
  const [values, setValues] = useStorage(`${storageKey}-values`, {});

  useEffect(() => {
    if (!storageKey) { return; }
    setSearchTerm(storedSearchTerm);
  }, []);

  useEffect(() => {
    setFilters(props.filters.map((filter) => ({
      ...filter,
      required: !!filter.required,
      operator: filter.operatorKey ? (storageKey && operators[filter.operatorKey] ? operators[filter.operatorKey] : 'or') : undefined,
      values: (storageKey && values[filter.key]) ? values[filter.key] : filter.values.map((value) => ({
        ...value,
        selected: value.default,
        default: value.default,
        display: value.display || value.value,
      })),
    })));
  }, [props.filters]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setOperators((previous) => filters
      .filter((filter) => filter.operatorKey)
      .reduce((o, filter) => ({
        ...o,
        [filter.operatorKey]: filter.operator,
      }), previous));
    setValues((previous) => filters
      .reduce((v, filter) => ({
        ...v,
        [filter.key]: filter.values,
      }), previous));
  }, [filters]);

  useEffect(() => {
    setStoredSearchTerm(searchTerm);
  }, [searchTerm]);

  const dispatch = (action, category, value) => {
    switch (action) {
      case 'clearFilter':
        if (analytics) {
          eventTrack({
            event: 'Clear Filter',
            category: analytics.category,
            label: category.display,
            group: analytics.group,
          });
        }
        clearFilter(filters.find((f) => f.key === category.key), category, setFilters);
        break;
      case 'hasSearched':
        setHasSearched(value ?? true);
        break;
      case 'resetFilter':
        if (analytics) {
          eventTrack({
            event: 'Reset Filter',
            category: analytics.category,
            label: category.display,
            group: analytics.group,
          });
        }
        resetFilter(filters.find((f) => f.key === category.key), category, setFilters);
        break;
      case 'resetAll':
        if (analytics) {
          eventTrack({
            event: 'Reset All Filters',
            category: analytics.category,
            group: analytics.group,
          });
        }
        setFilters((prev) => prev.map((f) => ({
          ...f,
          operator: f.operatorKey ? 'or' : undefined,
          values: f.values.map((v) => ({
            ...v,
            selected: v.default,
          })),
        })));
        break;
      case 'seeAllTextSearchResults':
        filters.forEach((c) => {
          clearFilter(filters.find((f) => f.key === c.key), c, setFilters);
        });
        break;
      case 'setFilterDisability':
        setFilterDisability(filters, category, value, setFilters);
        break;
      case 'toggle':
        toggleFilter(category, value, setFilters);
        break;
      case 'toggleOperator':
        toggleFilterOperator(category, setFilters);
        break;
      case 'toggleShowAll':
        toggleShowAll(filters, category, setFilters);
        break;
      case 'update':
        updateFilter(category, value, setFilters, setSearchTerm);
        break;
      default:
        console.log({ action, category, value });
    }
  };

  const queryParams = () => filters
    .concat({
      ...defaultFilter,
      key: 'searchTerm',
      values: [{ value: decodeURI(searchTerm), selected: decodeURI(searchTerm) }],
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
    analytics, dispatch, filters, hasSearched, queryParams, queryString, searchTerm, setSearchTerm,
  };

  /* eslint-disable react/jsx-props-no-spreading */
  return <FilterContext.Provider value={filterData} {...props} />;
  /* eslint-enable react/jsx-props-no-spreading */
}

FilterProvider.propTypes = {
  filters: arrayOf(filterPropType).isRequired,
  analytics: analyticsConfig,
  storageKey: string,
};

FilterProvider.defaultProps = {
  analytics: false,
  storageKey: '',
};

function useFilterContext() {
  return useContext(FilterContext);
}

export {
  FilterProvider, defaultFilter, getDateDisplay, getDateEntry, getDateTimeEntry, useFilterContext,
};
