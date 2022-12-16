import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'derivedCertificationEditions',
  display: 'Certification Edition',
  values: [
    { value: '2011' },
    { value: '2014' },
    { value: '2015', default: true },
    { value: '2015 Cures Update', default: true },
  ],
};

export default filter;
