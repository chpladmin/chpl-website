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
  filterFn: (item, f) => {
    if (!f.values.some((v) => v.selected)) { return true; }
    if (f.operator === 'or') {
      return f.values.some((v) => (v.selected && item.criteria.some((cc) => cc.id === v.id)));
    }
    return f.values.reduce((acc, v) => (v.selected ? acc && item.criteria.some((cc) => cc.id === v.id) : acc), true);
  },
};

export default filter;
