import React, { useEffect, useState } from 'react';

import ChplCorrectiveActionSearchView from './corrective-action-view';

import { useFetchAcbs } from 'api/acbs';
import { useFetchCriteria } from 'api/standards';
import { FilterProvider, defaultFilter } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  certificationDate,
  certificationStatuses,
} from 'components/filter/filters';

const staticFilters = [
  certificationDate,
  certificationStatuses, {
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

function ChplCorrectiveActionSearchPage() {
  const [filters, setFilters] = useState(staticFilters);
  const acbQuery = useFetchAcbs();
  const ccQuery = useFetchCriteria();

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
      .filter((cc) => cc.certificationEditionId === 3 || cc.certificationEditionId === null)
      .map((cc) => ({
        ...cc,
        value: cc.id,
        display: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.number}`,
        longDisplay: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.number}: ${cc.title}`,
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
      <ChplCorrectiveActionSearchView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplCorrectiveActionSearchPage;

ChplCorrectiveActionSearchPage.propTypes = {
};
