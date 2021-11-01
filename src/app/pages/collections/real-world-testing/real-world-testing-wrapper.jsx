import React from 'react';

import { UserWrapper } from '../../../components/login';
import ApiWrapper from '../../../api/api-wrapper';

import { FilterProvider } from './filter-context';
import ChplRealWorldTestingCollectionPage from './real-world-testing';

function ChplRealWorldTestingCollectionPageWrapper() {
  const initialFilters = [
    { key: 'certificationEdition', values: ['2015', '2015 Cures Update'] },
    { key: 'certificationStatus', values: ['Active', 'Withdrawn by Developer'] },
  ];

  return (
    <UserWrapper>
      <ApiWrapper>
        <FilterProvider
          filters={initialFilters}
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
