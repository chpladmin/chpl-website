import React, { useContext, useEffect, useState } from 'react';

import ChplApiDocumentationCollectionView from './api-documentation-view';

import { useFetchAcbs } from 'api/acbs';
import { useFetchCriteria } from 'api/standards';
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
  const [editionlessIsOn, setEditionlessIsOn] = useState(false);
  const [filters, setFilters] = useState(staticFilters);
  const acbQuery = useFetchAcbs();
  const ccQuery = useFetchCriteria();

  useEffect(() => {
    setEditionlessIsOn(isOn('editionless'));
  }, [isOn]);

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

  useEffect(() => {
    if (ccQuery.isLoading || !ccQuery.isSuccess) {
      return;
    }
    const values = ccQuery.data
      .filter((cc) => cc.certificationEditionId === 3)
      .map((cc) => ({
        ...cc,
        value: cc.id,
        display: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.number}${cc.title.includes('Cures Update') ? ' (Cures Update)' : ''}`,
        longDisplay: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.number}: ${cc.title}`,
        default: [56, 181, 182].includes(cc.id),
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...certificationCriteriaIds,
        values,
      }));
  }, [ccQuery.data, ccQuery.isLoading, ccQuery.isSuccess]);

  useEffect(() => {
    setFilters((f) => f
      .filter((filter) => filter.key !== 'derivedCertificationEditions' || !editionlessIsOn));
  }, [editionlessIsOn]);

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
