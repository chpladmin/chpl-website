import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'subscriptionType',
  display: 'Subscription Type',
  values: [
    { value: 'Listing', default: true },
    { value: 'Developer' },
  ],
};

export default filter;
