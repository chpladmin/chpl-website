import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'statuses',
  display: 'Developer Status',
  values: [
    { value: 'Suspended by ONC' },
    { value: 'Under certification ban by ONC' },
  ],
};

export default filter;
