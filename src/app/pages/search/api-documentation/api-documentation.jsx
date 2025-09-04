import React, { useEffect, useState } from 'react';

import ChplApiDocumentationSearchView from './api-documentation-view';

import { useFetchAcbs } from 'api/acbs';
import { useFetchCriteria } from 'api/standards';
import { FilterProvider } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  certificationDate,
  certificationStatuses,
} from 'components/filter/filters';
import { jsJoda } from 'services/date-util';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';

const staticFilters = [
  certificationDate,
  certificationStatuses,
];

function ChplApiDocumentationSearchPage() {
  const { analytics } = useAnalyticsContext();
  const acbQuery = useFetchAcbs();
  const ccQuery = useFetchCriteria();
  const [filters, setFilters] = useState(staticFilters);
  const [displayCriteria, setDisplayCriteria] = useState([]);

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
      .filter((cc) => cc.startDay <= jsJoda.LocalDate.now())
      .map((cc) => ({
        ...cc,
        value: cc.id,
        display: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.number}`,
        longDisplay: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.number}: ${cc.title}`,
        default: cc.attributes.apiDocumentation && !cc.removed,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...certificationCriteriaIds,
        values,
      }));
    setDisplayCriteria(values.filter((cc) => cc.default));
  }, [ccQuery.data, ccQuery.isLoading, ccQuery.isSuccess]);

  const data = {
    analytics: {
      ...analytics,
      category: 'CHPL Search - API Information',
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      <FilterProvider
        analytics={data.analytics}
        filters={filters}
        storageKey="storageKey-apiDocumentationPage"
      >
        <ChplApiDocumentationSearchView
          displayCriteria={displayCriteria}
        />
      </FilterProvider>
    </AnalyticsContext.Provider>
  );
}

export default ChplApiDocumentationSearchPage;

ChplApiDocumentationSearchPage.propTypes = {
};
