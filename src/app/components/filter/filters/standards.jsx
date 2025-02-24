import { getStandardValueEntry } from './value-entries';

import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'standardIds',
  display: 'Standards',
  operatorKey: 'standardOperator',
  getValueEntry: getStandardValueEntry,
};

export default filter;
