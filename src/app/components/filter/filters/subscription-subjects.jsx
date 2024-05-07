import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'subscriptionSubjects',
  display: 'Subscription Subject',
  values: [
    { value: 'Certification Status Changed' },
    { value: 'Certification Criterion Added' },
    { value: 'Certification Criterion Removed' },
    { value: 'RWT Plans URL Changed' },
    { value: 'RWT Results URL Changed' },
    { value: 'Service Base URL List Changed' },
  ],
};

export default filter;
