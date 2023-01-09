import { getAcbValueEntry } from './value-entries';

import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'certificationBodies',
  display: 'ONC-ACB',
  getValueEntry: getAcbValueEntry,
  values: [
    { value: 'CCHIT', display: 'CCHIT (Retired)' },
    { value: 'Drummond Group', default: true },
    { value: 'ICSA Labs', default: true },
    { value: 'Leidos', default: true },
    { value: 'SLI Compliance', default: true },
    { value: 'Surescripts LLC', display: 'Surescripts LLC (Retired)' },
    { value: 'UL LLC', display: 'UL LLC (Retired)' },
  ],
};

export default filter;
