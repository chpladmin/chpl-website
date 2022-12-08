import { getCriteriaValueEntry } from './value-entries';

import { defaultFilter } from 'components/filter';
import { sortCriteria } from 'services/criteria.service';

const filter = {
  ...defaultFilter,
  key: 'certificationCriteriaIds',
  display: 'Certification Criteria',
  operatorKey: 'certificationCriteriaOperator',
  sortValues: (f, a, b) => sortCriteria(a, b),
  getValueEntry: getCriteriaValueEntry,
};

export default filter;
