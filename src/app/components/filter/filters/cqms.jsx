import { getCqmValueEntry } from './value-entries';

import { defaultFilter } from 'components/filter';
import { sortCqms } from 'services/cqms.service';

const filter = {
  ...defaultFilter,
  key: 'cqms',
  display: 'Clinical Quality Measures',
  operatorKey: 'cqmsOperator',
  sortValues: (f, a, b) => sortCqms(a, b),
  getValueEntry: getCqmValueEntry,
};

export default filter;
