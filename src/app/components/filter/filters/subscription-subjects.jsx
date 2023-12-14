import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'subscriptionSubjects',
  display: 'Subscription Subject',
  values: [
    { value: 'Certification Status Changed' },
    { value: 'Certification Criterion Added' },
    { value: 'Certification Criterion Removed' },
  ],
};

export default filter;
