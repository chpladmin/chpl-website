import React, { useEffect, useState } from 'react';

import ChplSedCollectionView from './sed-view';

import { useFetchAcbs } from 'api/acbs';
import { FilterProvider } from 'components/filter';
import {
  certificationBodies,
  certificationDate,
  certificationStatuses,
  derivedCertificationEditions,
} from 'components/filter/filters';

const staticFilters = [
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
  const [filters, setFilters] = useState(staticFilters);
  const acbQuery = useFetchAcbs();

  useEffect(() => {
    if (acbQuery.isLoading || !acbQuery.isSuccess) {
      return;
    }
    const values = acbQuery.data.acbs
      .map((acb) => ({
        ...acb,
        value: acb.name,
        display: `${acb.retired ? 'Retired | ' : ''}${acb.name}`,
        default: !acb.retired || ((Date.now() - acb.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4)), // approx 4 months
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationBodies')
      .concat({
        ...certificationBodies,
        values,
      }));
  }, [acbQuery.data, acbQuery.isLoading, acbQuery.isSuccess]);

  const analytics = {
    category: 'SED Information for 2015 Edition Products',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
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
