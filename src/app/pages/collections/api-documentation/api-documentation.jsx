import React, { useContext, useEffect, useState } from 'react';

import ChplApiDocumentationCollectionView from './api-documentation-view';

import { useFetchCriteria } from 'api/data';
import { FilterProvider } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  certificationDate,
  certificationStatuses,
  derivedCertificationEditions,
} from 'components/filter/filters';
import { FlagContext } from 'shared/contexts';

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

function ChplApiDocumentationCollectionPage() {
  const { isOn } = useContext(FlagContext);
  const [erdPhase2IsOn, setErdPhase2IsOn] = useState(false);
  const [filters, setFilters] = useState(staticFilters);
  const ccQuery = useFetchCriteria();

  useEffect(() => {
    setErdPhase2IsOn(isOn('erd-phase-2'));
  }, [isOn]);

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
        default: erdPhase2IsOn ? [56, 181, 182].includes(cc.id) : [56, 57, 58, 181, 182].includes(cc.id),
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...certificationCriteriaIds,
        values,
      }));
  }, [ccQuery.data, ccQuery.isLoading, ccQuery.isSuccess, erdPhase2IsOn]);

  const analytics = {
    category: 'API Information for 2015 Edition Products',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-apiDocumentationPage"
    >
      <ChplApiDocumentationCollectionView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplApiDocumentationCollectionPage;

ChplApiDocumentationCollectionPage.propTypes = {
};
