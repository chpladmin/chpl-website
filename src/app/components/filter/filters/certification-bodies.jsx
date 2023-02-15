import { getAcbValueEntry } from './value-entries';

import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'certificationBodies',
  display: 'ONC-ACB',
  getValueEntry: getAcbValueEntry,
};

export default filter;
