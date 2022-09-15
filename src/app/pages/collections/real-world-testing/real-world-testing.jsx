import React from 'react';

import ChplRealWorldTestingCollectionView from './real-world-testing-view';

import ApiWrapper from 'api/api-wrapper';
import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateEntry,
} from 'components/filter';
import { UserWrapper } from 'components/login';

function ChplRealWorldTestingCollectionPage() {
  const analytics = {
    category: 'Real World Testing',
  };
  const filters = [{
    ...defaultFilter,
    key: 'derivedCertificationEditions',
    display: 'Certification Edition',
    required: true,
    values: [
      { value: '2015', default: true },
      { value: '2015 Cures Update', default: true },
    ],
  }, {
    ...defaultFilter,
    key: 'certificationDate',
    display: 'Certification Date',
    values: [
      { value: 'Before', default: '' },
      { value: 'After', default: '' },
    ],
    getQuery: (value) => value.values
      .sort((a, b) => (a.value < b.value ? -1 : 1))
      .map((v) => `${v.value === 'After' ? 'certificationDateStart' : 'certificationDateEnd'}=${v.selected}`)
      .join('&'),
    getValueDisplay: getDateDisplay,
    getValueEntry: getDateEntry,
  }, {
    ...defaultFilter,
    key: 'certificationStatuses',
    display: 'Certification Status',
    values: [
      { value: 'Active', default: true },
      { value: 'Suspended by ONC', default: true },
      { value: 'Suspended by ONC-ACB', default: true },
      { value: 'Terminated by ONC' },
      { value: 'Withdrawn by Developer Under Surveillance/Review' },
      { value: 'Withdrawn by ONC-ACB' },
      { value: 'Withdrawn by Developer' },
      { value: 'Retired' },
    ],
  }, {
    ...defaultFilter,
    key: 'certificationBodies',
    display: 'ONC-ACB',
    values: [
      { value: 'CCHIT', display: 'CCHIT (Retired)' },
      { value: 'Drummond Group', default: true },
      { value: 'ICSA Labs', default: true },
      { value: 'Leidos', default: true },
      { value: 'SLI Compliance', default: true },
      { value: 'Surescripts LLC', display: 'Surescripts LLC (Retired)' },
      { value: 'UL LLC', display: 'UL LLC (Retired)' },
    ],
  }];

  return (
    <UserWrapper>
      <ApiWrapper>
        <FilterProvider
          analytics={analytics}
          filters={filters}
        >
          <ChplRealWorldTestingCollectionView
            analytics={analytics}
          />
        </FilterProvider>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplRealWorldTestingCollectionPage;

ChplRealWorldTestingCollectionPage.propTypes = {
};
