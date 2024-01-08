import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'subscriberStatuses',
  display: 'Subscriber Status',
  values: [
    { value: 'Pending' },
    { value: 'Confirmed' },
  ],
};

export default filter;
