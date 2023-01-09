import React from 'react';

import ChplSedCollectionView from './sed-view';

import { FilterProvider } from 'components/filter';
import {
  certificationBodies,
  certificationDate,
  certificationStatuses,
  derivedCertificationEditions,
} from 'components/filter/filters';

const staticFilters = [
  certificationBodies,
  certificationDate,
  certificationStatuses, {
    ...derivedCertificationEditions,
    required: true,
    values: [
      { value: '2015', default: true },
      { value: '2015 Cures Update', default: true },
    ],
  }];

function ChplSedCollectionPage() {
  const analytics = {
    category: 'SED Information for 2015 Edition Products',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={staticFilters}
      storageKey="storageKey-sedPage"
    >
      <ChplSedCollectionView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplSedCollectionPage;

ChplSedCollectionPage.propTypes = {
};
