import { getRadioValueEntry } from './value-entries';

import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'quickFilters',
  display: 'Quick Filters',
  getValueEntry: getRadioValueEntry,
  singular: true,
  loneFilter: true,
  values: [
    { value: 'Previously Compared' },
    { value: 'Previously Viewed' },
  ],
};

export default filter;
