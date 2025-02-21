import { getStandardValueEntry } from './value-entries';

import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'standardIds',
  display: 'Standards',
  operatorKey: 'standardOperator',
  // sortValues: (f, a, b) => sortCqms(a, b),
  getValueEntry: getStandardValueEntry,
};

export default filter;
