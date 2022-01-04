import React from 'react';

import ChplRealWorldTestingCollectionPage from './real-world-testing';

import { UserWrapper } from 'components/login';
import ApiWrapper from 'api/api-wrapper';
import { FilterProvider } from 'components/filter';

function ChplRealWorldTestingCollectionPageWrapper() {
  const filters = [{
    key: 'derivedCertificationEditions',
    display: 'Certification Edition',
    required: true,
    values: [
      { value: '2015', default: true },
      { value: '2015 Cures Update', default: true },
    ],
  }, {
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
  }];

  return (
    <UserWrapper>
      <ApiWrapper>
        <FilterProvider
          filters={filters}
        >
          <ChplRealWorldTestingCollectionPage />
        </FilterProvider>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplRealWorldTestingCollectionPageWrapper;

ChplRealWorldTestingCollectionPageWrapper.propTypes = {
};
