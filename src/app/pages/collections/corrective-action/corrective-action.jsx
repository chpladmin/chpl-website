import React, { useEffect, useState } from 'react';

import ChplCorrectiveActionCollectionView from './corrective-action-view';

import { useFetchCriteria } from 'api/data';
import { FilterProvider, defaultFilter } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  certificationDate,
  certificationStatuses,
  derivedCertificationEditions,
} from 'components/filter/filters';

const staticFilters = [
  certificationBodies,
  certificationDate,
  certificationStatuses,
  derivedCertificationEditions, {
    ...defaultFilter,
    key: 'nonConformityOptions',
    display: 'Non-conformities',
    required: true,
    operatorKey: 'nonConformityOptionsOperator',
    values: [
      { value: 'open_nonconformity', display: 'Open Non-conformity', default: true },
      { value: 'closed_nonconformity', display: 'Closed Non-conformity', default: true },
    ],
  }];

function ChplCorrectiveActionCollectionPage() {
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
    category: 'Products: Corrective Action Status',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-correctiveActionPage"
    >
      <ChplCorrectiveActionCollectionView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplCorrectiveActionCollectionPage;

ChplCorrectiveActionCollectionPage.propTypes = {
};
