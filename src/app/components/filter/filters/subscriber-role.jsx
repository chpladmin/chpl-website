import { defaultFilter } from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'subscriberRole',
  display: 'Subscriber Role',
  values: [
    { value: 'Health IT Vendor' },
    { value: 'App Developer' },
    { value: 'HIE (Health Information Exchange)' },
    { value: 'Hospital or Healthcare System' },
    { value: 'Healthcare Provider' },
    { value: 'Pharmacy or Laboratory Service' },
    { value: 'Patient/Healthcare Consumer' },
    { value: 'Patient Advocacy Group' },
    { value: 'Payer' },
    { value: 'QIO (Quality Improvement Organization)' },
    { value: 'Public Health Department' },
    { value: 'Government (Federal, State, Local, Tribal)' },
    { value: 'Regulator' },
    { value: 'Educational Institution' },
    { value: 'Researcher' },
    { value: 'Other' },
  ],
};

export default filter;
