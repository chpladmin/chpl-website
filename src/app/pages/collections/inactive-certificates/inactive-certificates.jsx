import React, { useEffect, useState } from 'react';

import ChplInactiveCertificatesCollectionView from './inactive-certificates-view';

import { useFetchCriteria } from 'api/data';
import { FilterProvider } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  certificationDate,
  certificationStatuses,
  decertificationDate,
  derivedCertificationEditions,
} from 'components/filter/filters';

const staticFilters = [
  certificationBodies,
  certificationDate,
  decertificationDate, {
    ...derivedCertificationEditions,
    required: true,
    values: [
      { value: '2015', default: true },
      { value: '2015 Cures Update', default: true },
    ],
  }, {
    ...certificationStatuses,
    values: [
      { value: 'Active' },
      { value: 'Suspended by ONC' },
      { value: 'Suspended by ONC-ACB' },
      { value: 'Terminated by ONC' },
      { value: 'Withdrawn by Developer Under Surveillance/Review' },
      { value: 'Withdrawn by ONC-ACB' },
      { value: 'Withdrawn by Developer', default: true },
      { value: 'Retired' },
    ],
  }];

function ChplInactiveCertificatesCollectionPage() {
  const [filters, setFilters] = useState(staticFilters);
  const ccQuery = useFetchCriteria();

  useEffect(() => {
    if (ccQuery.isLoading || !ccQuery.isSuccess) {
      return;
    }
    const values = ccQuery.data.criteria
      .filter((cc) => cc.certificationEditionId === 3)
      .map((cc) => ({
        ...cc,
        value: cc.id,
        display: `${cc.removed ? 'Removed | ' : ''}${cc.number}${cc.title.includes('Cures Update') ? ' (Cures Update)' : ''}`,
        longDisplay: `${cc.removed ? 'Removed | ' : ''}${cc.number}: ${cc.title}`,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...certificationCriteriaIds,
        values,
      }));
  }, [ccQuery.data, ccQuery.isLoading, ccQuery.isSuccess]);

  const analytics = {
    category: 'Inactive Certificates',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-inactiveCertificatesPage"
    >
      <ChplInactiveCertificatesCollectionView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplInactiveCertificatesCollectionPage;

ChplInactiveCertificatesCollectionPage.propTypes = {
};
