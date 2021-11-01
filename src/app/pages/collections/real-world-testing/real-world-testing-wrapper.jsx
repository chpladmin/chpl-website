import React from 'react';

import { UserWrapper } from '../../../components/login';
import ApiWrapper from '../../../api/api-wrapper';

import { FilterProvider } from './filter-context';
import ChplRealWorldTestingCollectionPage from './real-world-testing';

function ChplRealWorldTestingCollectionPageWrapper() {
  const filters = [{
    key: 'certificationEditions',
    display: 'Certification Edition',
    values: [{
      value: '2011',
    }, {
      value: '2014',
    }, {
      value: '2015',
      selected: true,
      default: true,
    }, {
      value: '2015 Cures Update',
      selected: true,
      default: true,
    }],
  }, {
    key: 'certificationStatuses',
    display: 'Certification Status',
    values: [{
      value: 'Active',
      selected: true,
      default: true,
    }, {
      value: 'Withdrawn by Developer',
      selected: true,
      default: true,
    }, {
      value: 'Retired',
    }],
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
